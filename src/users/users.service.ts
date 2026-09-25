import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { ListQueryDto } from '../common/dto/list-query.dto';
import { buildPrismaQuery } from '../common/utils/prisma-query.util';
import { getNextSeqNo } from 'src/common/utils/sequence.util';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { QueryUsersDto } from './dto/query-user.dto';

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
  private readonly bcryptRounds: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.bcryptRounds = Number(
      this.configService.get<string>('BCRYPT_ROUNDS') ?? 12,
    );
  }

  /**
   * Used internally by authentication.
   * This method intentionally includes the password hash.
   * Never return its result directly from a public API.
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: userInclude,
    });
  }

  /**
   * Used internally where the password hash may be required.
   * Never return its result directly from a public API.
   */
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: userInclude,
    });
  }

  /**
   * Safe user response for API endpoints.
   * Password is deliberately excluded.
   */
  private readonly safeUserSelect = {
    id: true,
    seqNo: true,
    name: true,
    email: true,
    roleId: true,
    organizationId: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
    role: true,
    organization: true,
    permissions: {
      include: {
        permission: true,
      },
    },
  } as const;

  private async validateRole(roleId: string) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!role) {
      throw new BadRequestException('The specified role does not exist');
    }

    if (!role.isActive) {
      throw new BadRequestException('The specified role is inactive');
    }
  }

  private async validateOrganization(organizationId?: string | null) {
    if (!organizationId) {
      return;
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!organization) {
      throw new BadRequestException(
        'The specified organization does not exist',
      );
    }

    if (!organization.isActive) {
      throw new BadRequestException(
        'The specified organization is inactive',
      );
    }
  }

  async create(dto: CreateUserDto) {
    const email = dto.email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException(
        `A user with email "${email}" already exists`,
      );
    }

    await this.validateRole(dto.roleId);
    await this.validateOrganization(dto.organizationId);

    const hashedPassword = await bcrypt.hash(
      dto.password,
      this.bcryptRounds,
    );

    const seqNo = await getNextSeqNo(this.prisma, 'user');

    try {
      return await this.prisma.user.create({
        data: {
          seqNo,
          name: dto.name.trim(),
          email,
          password: hashedPassword,
          roleId: dto.roleId,
          organizationId: dto.organizationId ?? null,
        },
        select: this.safeUserSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `A user with email "${email}" already exists`,
        );
      }

      throw error;
    }
  }

  async findAll(query: QueryUsersDto) {
    const prismaQuery = buildPrismaQuery(query, ['name', 'email']);

    const where: Prisma.UserWhereInput = {
      ...(prismaQuery.where ?? {}),
    };

    if (query.roleId) {
      where.roleId = query.roleId;
    }

    if (query.organizationId) {
      where.organizationId = query.organizationId;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        ...prismaQuery,
        where,
        select: this.safeUserSelect,
      }),
      this.prisma.user.count({ where }),
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

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.safeUserSelect,
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
      },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const data: Prisma.UserUpdateInput = {};

    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }

    if (dto.email !== undefined) {
      const email = dto.email.trim().toLowerCase();

      const duplicateUser = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (duplicateUser && duplicateUser.id !== id) {
        throw new ConflictException(
          `A user with email "${email}" already exists`,
        );
      }

      data.email = email;
    }

    if (dto.roleId !== undefined) {
      await this.validateRole(dto.roleId);
      data.role = {
        connect: { id: dto.roleId },
      };
    }

    if (dto.organizationId !== undefined) {
      await this.validateOrganization(dto.organizationId);

      data.organization =
        dto.organizationId === null
          ? { disconnect: true }
          : { connect: { id: dto.organizationId } };
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        select: this.safeUserSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A user with this email already exists',
        );
      }

      throw error;
    }
  }

  async updateStatus(id: string, dto: UpdateUserStatusDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: dto.isActive,
      },
      select: this.safeUserSelect,
    });
  }

  /**
   * Retained for compatibility with your existing user-delete permission.
   * This performs a soft delete, not a physical database deletion.
   */
  async remove(id: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
      },
      select: this.safeUserSelect,
    });
  }
}