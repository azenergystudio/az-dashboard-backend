import { Injectable } from '@nestjs/common';
import { ListQueryDto } from 'src/common/dto/list-query.dto';
import { buildPrismaQuery } from 'src/common/utils/prisma-query.util';
import { PrismaService } from 'src/prisma/prisma.service';

const userInclude = {
  role: true,

  organization: true,

  permissions: {
    include: {
      permission: true,
    },
  },
} as const;

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async findByEmail(email: string) {
  return this.prisma.user.findUnique({
    where: {
      email,
    },

    include: userInclude,
  });
}

async findById(id: string) {
  return this.prisma.user.findUnique({
    where: {
      id,
    },

    include: userInclude,
  });
}

async findAll(query: ListQueryDto) {
  const prismaQuery = buildPrismaQuery(query);

  const [users, total] = await this.prisma.$transaction([
    this.prisma.user.findMany({
      ...prismaQuery,
    }),

    this.prisma.user.count(),
  ]);

  return {
    data: users,

    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}
}
