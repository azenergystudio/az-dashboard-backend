import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { AddUserPermissionDto } from './dto/add-user-permission.dto';
import { UpdateUserPermissionsDto } from './dto/update-user-permission.dto';

@Injectable()
export class UserPermissionsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID "${userId}" not found`,
      );
    }

    if (!user.isActive) {
      throw new BadRequestException(
        'Cannot assign permissions to an inactive user',
      );
    }

    return user;
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
    return this.prisma.userPermission.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            organizationId: true,
            isActive: true,
          },
        },
        permission: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUser(userId: string) {
    await this.validateUser(userId);

    return this.prisma.userPermission.findMany({
      where: {
        userId,
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
    userId: string,
    dto: AddUserPermissionDto,
  ) {
    await this.validateUser(userId);

    await this.validatePermissions([
      dto.permissionId,
    ]);

    const existing =
      await this.prisma.userPermission.findUnique({
        where: {
          userId_permissionId: {
            userId,
            permissionId: dto.permissionId,
          },
        },
      });

    if (existing) {
      throw new ConflictException(
        'This permission is already assigned to the user',
      );
    }

    return this.prisma.userPermission.create({
      data: {
        userId,
        permissionId: dto.permissionId,
      },
      include: {
        permission: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async replacePermissions(
    userId: string,
    dto: UpdateUserPermissionsDto,
  ) {
    await this.validateUser(userId);

    await this.validatePermissions(
      dto.permissionIds,
    );

    await this.prisma.$transaction(
      async (tx) => {
        await tx.userPermission.deleteMany({
          where: {
            userId,
          },
        });

        if (dto.permissionIds.length) {
          await tx.userPermission.createMany({
            data: dto.permissionIds.map(
              (permissionId) => ({
                userId,
                permissionId,
              }),
            ),
          });
        }
      },
    );

    return this.findByUser(userId);
  }

  async removePermission(
    userId: string,
    permissionId: string,
  ) {
    const mapping =
      await this.prisma.userPermission.findUnique({
        where: {
          userId_permissionId: {
            userId,
            permissionId,
          },
        },
      });

    if (!mapping) {
      throw new NotFoundException(
        'This permission is not assigned to the user',
      );
    }

    await this.prisma.userPermission.delete({
      where: {
        userId_permissionId: {
          userId,
          permissionId,
        },
      },
    });

    return {
      message:
        'Permission removed from user successfully',
    };
  }
}