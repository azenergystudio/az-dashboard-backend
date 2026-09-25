import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { getNextSeqNo } from 'src/common/utils/sequence.util';
import { buildPrismaQuery } from 'src/common/utils/prisma-query.util';
import { prismaPaginate } from 'src/common/utils/prisma-pagination';

import { CreateEquipmentTypeDto } from './dto/create-equipment-type.dto';  
import { EquipmentTypeQueryDto } from './dto/equipment-type-query.dto';
import { UpdateEquipmentTypeDto } from './dto/update-equipment-type-query.dto';

@Injectable()
export class EquipmentTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEquipmentTypeDto) {
    const existing = await this.prisma.equipmentType.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Equipment type with this name already exists',
      );
    }

    const seqNo = await getNextSeqNo(this.prisma, 'equipmentType');

    return this.prisma.equipmentType.create({
      data: {
        seqNo,
        name: dto.name,
        description: dto.description,
      },
    });
  }

  async findAll(query: EquipmentTypeQueryDto) {
    const prismaQuery = buildPrismaQuery(query, ['name', 'description']);

    const where = prismaQuery.where;

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    return prismaPaginate(this.prisma, this.prisma.equipmentType, {
      ...prismaQuery,
      where,
    });
  }

  async findOne(id: string) {
    const equipmentType = await this.prisma.equipmentType.findUnique({
      where: {
        id,
      },
    });

    if (!equipmentType) {
      throw new NotFoundException('Equipment type not found');
    }

    return equipmentType;
  }

  async update(id: string, dto: UpdateEquipmentTypeDto) {
    await this.findOne(id);

    if (dto.name) {
      const existing = await this.prisma.equipmentType.findFirst({
        where: {
          name: dto.name,
          NOT: {
            id,
          },
        },
      });

      if (existing) {
        throw new ConflictException(
          'Equipment type with this name already exists',
        );
      }
    }

    return this.prisma.equipmentType.update({
      where: {
        id,
      },
      data: {
        ...(dto.name !== undefined && {
          name: dto.name,
        }),
        ...(dto.description !== undefined && {
          description: dto.description,
        }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.equipmentType.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
}