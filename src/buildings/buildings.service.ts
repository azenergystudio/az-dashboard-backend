import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBuildingDto } from './dtos/create-building.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getNextSeqNo } from 'src/common/utils/sequence.util';
import { BuildingQueryDto } from './dtos/building-query.dto';
import { UpdateBuildingDto } from './dtos/update-building.dto';
import { buildPrismaQuery } from 'src/common/utils/prisma-query.util';
import { prismaPaginate } from 'src/common/utils/prisma-pagination';

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
  const prismaQuery =
    buildPrismaQuery(query, [
      'name',
      'description',
    ]);

  const where =
    prismaQuery.where;

  if (query.organizationId) {
    where.organizationId =
      query.organizationId;
  }

  if (query.isActive !== undefined) {
    where.isActive =
      query.isActive;
  }

  return prismaPaginate(
    this.prisma,
    this.prisma.building,
    {
      ...prismaQuery,

      where,

      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  );
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
