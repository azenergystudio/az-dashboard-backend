import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBuildingDto } from './dtos/create-building.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getNextSeqNo } from 'src/common/utils/sequence.util';
import { BuildingQueryDto } from './dtos/building-query.dto';
import { UpdateBuildingDto } from './dtos/update-building.dto';
import { buildPrismaQuery } from 'src/common/utils/prisma-query.util';

@Injectable()
export class BuildingsService {
constructor( 
    private readonly prisma: PrismaService
){}
    async create(dto: CreateBuildingDto) {
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

  const exists =
    await this.prisma.building.findFirst({
      where: {
        organizationId: dto.organizationId,
        name: dto.name,
      },
    });

  if (exists) {
    throw new ConflictException(
      'Building already exists',
    );
  }

  const seqNo = await getNextSeqNo(
    this.prisma,
    'building',
  );
  

  return this.prisma.building.create({
    data: {
      seqNo,
      ...dto,
      
    },
  });
}

async findAll(query: BuildingQueryDto) {
  const prismaQuery = buildPrismaQuery(query, [
    'name',
    'description',
  ]);

  if (query.organizationId) {
    prismaQuery.where.organizationId =
      query.organizationId;
  }

  if (query.isActive !== undefined) {
    prismaQuery.where.isActive =
      query.isActive;
  }

  const [items, total] =
    await this.prisma.$transaction([
      this.prisma.building.findMany({
        ...prismaQuery,
        include: {
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      this.prisma.building.count({
        where: prismaQuery.where,
      }),
    ]);

  return {
    items,
    total,
    page: query.page,
    limit: query.limit,
    totalPages: Math.ceil(
      total / query.limit,
    ),
  };
}

async findOne(id: string) {
  const building =
    await this.prisma.building.findUnique({
      where: {
        id,
      },
      include: {
        organization: true,
      },
    });

  if (!building) {
    throw new NotFoundException(
      'Building not found',
    );
  }

  return building;
}

async update(
  id: string,
  dto: UpdateBuildingDto,
) {
  await this.findOne(id);

  if (dto.name) {
    const exists =
      await this.prisma.building.findFirst({
        where: {
          organizationId:
            dto.organizationId,
          name: dto.name,
          NOT: {
            id,
          },
        },
      });

    if (exists) {
      throw new ConflictException(
        'Building already exists',
      );
    }
  }

  return this.prisma.building.update({
    where: {
      id,
    },
    data: dto,
  });
}

async remove(id: string) {
  await this.findOne(id);

  return this.prisma.building.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
}
}
