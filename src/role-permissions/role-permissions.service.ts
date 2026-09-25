import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { AddRolePermissionDto } from './dto/add-role-permissions.dto';

@Injectable()
export class RolePermissionsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private async validateRole(roleId: string) {
    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });

    if (!role) {
      throw new NotFoundException(
        `Role with ID "${roleId}" not found`,
      );
    }

    if (!role.isActive) {
      throw new BadRequestException(
        'Cannot assign permissions to an inactive role',
      );
    }

    return role;
  }

  private async validatePermissions(
    permissionIds: string[],
  ) {
    const uniqueIds = new Set(permissionIds);

    if (uniqueIds.size !== permissionIds.length) {
      throw new BadRequestException(
        'Duplicate permission IDs are not allowed',
      );
    }

    if (!permissionIds.length) {
      return;
    }

    const permissions =
      await this.prisma.permission.findMany({
        where: {
          id: {
            in: permissionIds,
          },
          isActive: true,
        },
        select: {
          id: true,
        },
      });

    const foundIds = new Set(
      permissions.map(
        (permission) => permission.id,
      ),
    );

    const invalidIds = permissionIds.filter(
      (id) => !foundIds.has(id),
    );

    if (invalidIds.length) {
      throw new BadRequestException(
        `One or more permissions do not exist or are inactive: ${invalidIds.join(', ')}`,
      );
    }
  }

  async findAll() {
    return this.prisma.rolePermission.findMany({
      include: {
        role: true,
        permission: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByRole(roleId: string) {
    await this.validateRole(roleId);

    return this.prisma.rolePermission.findMany({
      where: {
        roleId,
      },
      include: {
        permission: true,
      },
      orderBy: {
        permission: {
          name: 'asc',
        },
      },
    });
  }

  async addPermission(
    roleId: string,
    dto: AddRolePermissionDto,
  ) {
    await this.validateRole(roleId);

    await this.validatePermissions([
      dto.permissionId,
    ]);

    const existing =
      await this.prisma.rolePermission.findUnique({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId: dto.permissionId,
          },
        },
      });

    if (existing) {
      throw new ConflictException(
        'This permission is already assigned to the role',
      );
    }

    return this.prisma.rolePermission.create({
      data: {
        roleId,
        permissionId: dto.permissionId,
      },
      include: {
        permission: true,
        role: true,
      },
    });
  }

  async replacePermissions(
    roleId: string,
    dto: UpdateRolePermissionsDto,
  ) {
    await this.validateRole(roleId);

    await this.validatePermissions(
      dto.permissionIds,
    );

    await this.prisma.$transaction(
      async (tx) => {
        await tx.rolePermission.deleteMany({
          where: {
            roleId,
          },
        });

        if (dto.permissionIds.length) {
          await tx.rolePermission.createMany({
            data: dto.permissionIds.map(
              (permissionId) => ({
                roleId,
                permissionId,
              }),
            ),
          });
        }
      },
    );

    return this.findByRole(roleId);
  }

  async removePermission(
    roleId: string,
    permissionId: string,
  ) {
    const mapping =
      await this.prisma.rolePermission.findUnique({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
      });

    if (!mapping) {
      throw new NotFoundException(
        'This permission is not assigned to the role',
      );
    }

    await this.prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });

    return {
      message: 'Permission removed from role successfully',
    };
  }
}