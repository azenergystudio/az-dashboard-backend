import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getPermissions(
    userId: string,
    roleId: string,
  ): Promise<Set<string>> {
    const rolePermissions =
      await this.prisma.rolePermission.findMany({
        where: {
          roleId,
          permission: {
            isActive: true,
          },
        },
        include: {
          permission: true,
        },
      });

    const userPermissions =
      await this.prisma.userPermission.findMany({
        where: {
          userId,
          permission: {
            isActive: true,
          },
        },
        include: {
          permission: true,
        },
      });

    const permissions = new Set<string>();

    rolePermissions.forEach((p) =>
      permissions.add(p.permission.name),
    );

    userPermissions.forEach((p) =>
      permissions.add(p.permission.name),
    );

    return permissions;
  }
}