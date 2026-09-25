import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { buildPrismaQuery } from '../common/utils/prisma-query.util';
import { getNextSeqNo } from 'src/common/utils/sequence.util';

import { CreateParameterDto } from './dto/create-parameter.dto';
import { UpdateParameterDto } from './dto/update-parameter.dto';
import { ParameterQueryDto } from './dto/parameter-query';
import { prismaPaginate } from 'src/common/utils/prisma-pagination';


@Injectable()
export class ParametersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateParameterDto) {
    const existing = await this.prisma.parameter.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException(
        `Parameter "${dto.name}" already exists`,
      );
    }

    const seqNo = await getNextSeqNo(this.prisma, 'parameter');

    return this.prisma.parameter.create({
      data: {
        seqNo,
        name: dto.name,
        unit: dto.unit,
        description: dto.description,
      },
    });
  }

  async findAll(query: ParameterQueryDto) {
    const prismaQuery = buildPrismaQuery(query, [
      'name',
      'unit',
      'description',
    ]);

    const where = {
      ...prismaQuery.where,
      ...(query.isActive !== undefined
        ? { isActive: query.isActive }
        : {}),
    };

    return prismaPaginate(this.prisma, this.prisma.parameter, {
      ...prismaQuery,
      where,
    });
  }

  async findOne(id: string) {
    const parameter = await this.prisma.parameter.findUnique({
      where: { id },
    });

    if (!parameter) {
      throw new NotFoundException(
        `Parameter with ID "${id}" not found`,
      );
    }

    return parameter;
  }

  async update(id: string, dto: UpdateParameterDto) {
    await this.findOne(id);

    if (dto.name) {
      const existing = await this.prisma.parameter.findUnique({
        where: { name: dto.name },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Parameter "${dto.name}" already exists`,
        );
      }
    }

    return this.prisma.parameter.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.parameter.update({
      where: { id },
      data: { isActive: false },
    });
  }
}