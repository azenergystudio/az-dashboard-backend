import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateOrganizationDto } from './dto/create-organization.dto';

import { OrganizationQueryDto } from './dto/organization-query.dto';

import { buildPrismaQuery } from '../common/utils/prisma-query.util';
import { paginate } from '../common/utils/pagination.util';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { getNextSeqNo } from 'src/common/utils/sequence.util';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private generateSlug(name: string) {
    return name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  }

  async create(dto: CreateOrganizationDto) {
    dto.name = dto.name.trim();

    dto.email = dto.email?.trim().toLowerCase();

    const existingName =
      await this.prisma.organization.findFirst({
        where: {
          name: dto.name,
        },
      });

    if (existingName) {
      throw new ConflictException(
        'Organization name already exists',
      );
    }

    if (dto.email) {
      const existingEmail =
        await this.prisma.organization.findFirst({
          where: {
            email: dto.email,
          },
        });

      if (existingEmail) {
        throw new ConflictException(
          'Organization email already exists',
        );
      }
    }

const seqNo = await getNextSeqNo(
  this.prisma,
  'organization',
);

return this.prisma.organization.create({
  data: {
    seqNo,
    ...dto,
    slug: this.generateSlug(dto.name),
  },
});
  }

  async findAll(query: OrganizationQueryDto) {
    const prismaQuery = buildPrismaQuery(query, [
      'name',
      'email',
      'phone',
    ]);

    const [data, total] =
      await this.prisma.$transaction([
        this.prisma.organization.findMany(prismaQuery),
        this.prisma.organization.count({
          where: prismaQuery.where,
        }),
      ]);

    return paginate(
      data,
      total,
      query.page,
      query.limit,
    );
  }

  async findOne(id: string) {
    const organization =
      await this.prisma.organization.findUnique({
        where: { id },
      });

    if (!organization) {
      throw new NotFoundException(
        'Organization not found',
      );
    }

    return organization;
  }

  async update(
    id: string,
    dto: UpdateOrganizationDto,
  ) {
    await this.findOne(id);

    if (dto.name) {
      const existing =
        await this.prisma.organization.findFirst({
          where: {
            name: dto.name,
            NOT: {
              id,
            },
          },
        });

      if (existing) {
        throw new ConflictException(
          'Organization name already exists',
        );
      }
    }

    if (dto.email) {
      const existing =
        await this.prisma.organization.findFirst({
          where: {
            email: dto.email,
            NOT: {
              id,
            },
          },
        });

      if (existing) {
        throw new ConflictException(
          'Organization email already exists',
        );
      }
    }

    return this.prisma.organization.update({
      where: {
        id,
      },
      data: {
        ...dto,
        ...(dto.name && {
          slug: this.generateSlug(dto.name),
        }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.organization.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
}