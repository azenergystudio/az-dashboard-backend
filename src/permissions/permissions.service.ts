import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';

import { QueryPermissionsDto } from './dto/query-permissions.dto';

import { buildPrismaQuery } from '../common/utils/prisma-query.util';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(query: QueryPermissionsDto) {
    const prismaQuery = buildPrismaQuery(
      query,
      ['name', 'description'],
    );

    const where: Prisma.PermissionWhereInput = {
      ...(prismaQuery.where ?? {}),
    };

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const [permissions, total] =
      await this.prisma.$transaction([
        this.prisma.permission.findMany({
          ...prismaQuery,
          where,
          select: {
            id: true,
            seqNo: true,
            module: true,
            name: true,
            description: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        }),

        this.prisma.permission.count({
          where,
        }),
      ]);

    return {
      data: permissions,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(
          total / query.limit,
        ),
      },
    };
  }

  async findOne(id: string) {
    const permission =
      await this.prisma.permission.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          seqNo: true,
          module: true,
          name: true,
          description: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    if (!permission) {
      throw new NotFoundException(
        `Permission with ID "${id}" not found`,
      );
    }

    return permission;
  }
}