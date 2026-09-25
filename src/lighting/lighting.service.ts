import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { buildPrismaQuery } from '../common/utils/prisma-query.util';
import { getNextSeqNo } from 'src/common/utils/sequence.util';
import { prismaPaginate } from '../common/utils/prisma-pagination';
import { CreateLightingDto } from './dto/create-lighting.dto';
import { UpdateLightingDto } from './dto/update-lighting.dto';
import { LightingQueryDto } from './dto/lighting-query.dto';

@Injectable()
export class LightingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLightingDto) {
    const existing = await this.prisma.lighting.findUnique({
      where: { tag: dto.tag },
    });

    if (existing) {
      throw new ConflictException(
        `Lighting with tag "${dto.tag}" already exists`,
      );
    }

    const seqNo = await getNextSeqNo(this.prisma, 'lighting');

    return this.prisma.lighting.create({
      data: {
        seqNo,
        tag: dto.tag,
        name: dto.name,
        wattage: dto.wattage,
        manufacturer: dto.manufacturer,
        model: dto.model,
      },
    });
  }

  async findAll(query: LightingQueryDto) {
    const pagination = buildPrismaQuery(query, [
      'tag',
      'name',
      'manufacturer',
      'model',
    ]);

    const where: Record<string, any> = {
      ...pagination.where,
    };

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query.manufacturer) {
      where.manufacturer = {
        contains: query.manufacturer,
        mode: 'insensitive',
      };
    }

    return prismaPaginate(
      this.prisma,
      this.prisma.lighting,
      {
        ...pagination,
        where,
      },
    );
  }

  async findOne(id: string) {
    const lighting = await this.prisma.lighting.findUnique({
      where: { id },
      include: {
        installations: {
          include: {
            room: true,
          },
        },
      },
    });

    if (!lighting) {
      throw new NotFoundException(`Lighting with ID "${id}" not found`);
    }

    return lighting;
  }

  async update(id: string, dto: UpdateLightingDto) {
    await this.ensureExists(id);

    if (dto.tag) {
      const existing = await this.prisma.lighting.findUnique({
        where: { tag: dto.tag },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Lighting with tag "${dto.tag}" already exists`,
        );
      }
    }

    return this.prisma.lighting.update({
      where: { id },
      data: {
        tag: dto.tag,
        name: dto.name,
        wattage: dto.wattage,
        manufacturer: dto.manufacturer,
        model: dto.model,
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);

    return this.prisma.lighting.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private async ensureExists(id: string) {
    const lighting = await this.prisma.lighting.findUnique({
      where: { id },
    });

    if (!lighting) {
      throw new NotFoundException(`Lighting with ID "${id}" not found`);
    }

    return lighting;
  }
}