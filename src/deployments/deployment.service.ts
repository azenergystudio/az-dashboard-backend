import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateDeploymentDto } from './dto/create-deployment.dto';
import { UpdateDeploymentDto } from './dto/update-deployment.dto';
import { DeploymentQueryDto } from './dto/deployment-query.dto';

import { buildPrismaQuery } from '../common/utils/prisma-query.util';
import { paginate } from '../common/utils/pagination.util';
import { getNextSeqNo } from '../common/utils/sequence.util';

@Injectable()
export class DeploymentService {
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

  async create(dto: CreateDeploymentDto) {
    const name = dto.name.trim();

    const slug =
      dto.slug?.trim().toLowerCase() ||
      this.generateSlug(name);

    const existingSlug =
      await this.prisma.deployment.findUnique({
        where: {
          slug,
        },
      });

    if (existingSlug) {
      throw new ConflictException(
        'Deployment slug already exists',
      );
    }

    if (dto.organizationId) {
      const organization =
        await this.prisma.organization.findUnique({
          where: {
            id: dto.organizationId,
          },
        });

      if (!organization) {
        throw new NotFoundException(
          'Organization not found',
        );
      }
    }

    const seqNo = await getNextSeqNo(
      this.prisma,
      'deployment',
    );

    return this.prisma.deployment.create({
      data: {
        seqNo,
        name,
        slug,
        organizationId: dto.organizationId,
        environment:
          dto.environment?.trim() || 'production',
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        configuration: true,
      },
    });
  }

  async findAll(query: DeploymentQueryDto) {
    const prismaQuery = buildPrismaQuery(
      query,
      [
        'name',
        'slug',
        'environment',
      ],
    );

    const where = {
      ...prismaQuery.where,

      ...(query.isActive !== undefined && {
        isActive: query.isActive,
      }),

      ...(query.organizationId && {
        organizationId: query.organizationId,
      }),

      ...(query.environment && {
        environment: query.environment,
      }),
    };

    const [data, total] =
      await this.prisma.$transaction([
        this.prisma.deployment.findMany({
          ...prismaQuery,
          where,
          include: {
            organization: {
              select: {
                id: true,
                name: true,
              },
            },
            configuration: {
              select: {
                id: true,
                version: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        }),

        this.prisma.deployment.count({
          where,
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
    const deployment =
      await this.prisma.deployment.findUnique({
        where: {
          id,
        },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
          configuration: true,
        },
      });

    if (!deployment) {
      throw new NotFoundException(
        'Deployment not found',
      );
    }

    return deployment;
  }

  async update(
    id: string,
    dto: UpdateDeploymentDto,
  ) {
    await this.findOne(id);

    if (dto.slug) {
      const slug = dto.slug.trim().toLowerCase();

      const existing =
        await this.prisma.deployment.findFirst({
          where: {
            slug,
            NOT: {
              id,
            },
          },
        });

      if (existing) {
        throw new ConflictException(
          'Deployment slug already exists',
        );
      }

      dto.slug = slug;
    }

    if (dto.organizationId) {
      const organization =
        await this.prisma.organization.findUnique({
          where: {
            id: dto.organizationId,
          },
        });

      if (!organization) {
        throw new NotFoundException(
          'Organization not found',
        );
      }
    }

    return this.prisma.deployment.update({
      where: {
        id,
      },
      data: {
        ...dto,
        ...(dto.name && {
          name: dto.name.trim(),
        }),
        ...(dto.environment && {
          environment: dto.environment.trim(),
        }),
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        configuration: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.deployment.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
}