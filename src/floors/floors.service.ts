import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { FloorQueryDto } from './dto/floor-query.dto';
import { getNextSeqNo } from 'src/common/utils/sequence.util';
import { buildPrismaQuery } from 'src/common/utils/prisma-query.util';



@Injectable()
export class FloorsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateFloorDto) {
    const building =
      await this.prisma.building.findUnique({
        where: {
          id: dto.buildingId,
        },
      });

    if (!building) {
      throw new NotFoundException(
        'Building not found',
      );
    }

    const existing =
      await this.prisma.floor.findFirst({
        where: {
          buildingId: dto.buildingId,
          floorNumber: dto.floorNumber,
        },
      });

    if (existing) {
      throw new ConflictException(
        'Floor number already exists in this building',
      );
    }

    const seqNo = await getNextSeqNo(
      this.prisma,
      'floor',
    );

    return this.prisma.floor.create({
      data: {
        seqNo,
        ...dto,
      },
    });
  }

async findAll(query: FloorQueryDto) {
  const prismaQuery = buildPrismaQuery(query, [
    'name',
  ]);

  if (query.buildingId) {
    prismaQuery.where.buildingId =
      query.buildingId;
  }

  const [items, total] =
    await this.prisma.$transaction([
      this.prisma.floor.findMany({
        ...prismaQuery,
        include: {
          building: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      this.prisma.floor.count({
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
    const floor =
      await this.prisma.floor.findUnique({
        where: {
          id,
        },
        include: {
          building: true,
        },
      });

    if (!floor) {
      throw new NotFoundException(
        'Floor not found',
      );
    }

    return floor;
  }

  async update(
    id: string,
    dto: UpdateFloorDto,
  ) {
    await this.findOne(id);

    if (
      dto.floorNumber !== undefined
    ) {
      const existing =
        await this.prisma.floor.findFirst({
          where: {
            buildingId:
              dto.buildingId,
            floorNumber:
              dto.floorNumber,
            NOT: {
              id,
            },
          },
        });

      if (existing) {
        throw new ConflictException(
          'Floor number already exists in this building',
        );
      }
    }

    return this.prisma.floor.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.floor.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
}