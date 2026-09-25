import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { buildPrismaQuery } from '../common/utils/prisma-query.util';
import { getNextSeqNo } from 'src/common/utils/sequence.util';
import { prismaPaginate } from '../common/utils/prisma-pagination';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { SensorQueryDto } from './dto/sensor-query.dto';

@Injectable()
export class SensorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSensorDto) {
    await this.ensureRoomExists(dto.roomId);

    const seqNo = await getNextSeqNo(this.prisma, 'sensor');

    return this.prisma.sensor.create({
      data: {
        seqNo,
        name: dto.name,
        tag: dto.tag,
        type: dto.type,
        unit: dto.unit,
        roomId: dto.roomId,
      },
      include: {
        room: true,
      },
    });
  }

  async findAll(query: SensorQueryDto) {
    const pagination = buildPrismaQuery(query, [
      'name',
      'tag',
      'type',
      'unit',
    ]);

    const where: Record<string, any> = {
      ...pagination.where,
    };

    if (query.roomId) {
      where.roomId = query.roomId;
    }

    if (query.type) {
      where.type = {
        contains: query.type,
        mode: 'insensitive',
      };
    }

    return prismaPaginate(
      this.prisma,
      this.prisma.sensor,
      {
        ...pagination,
        where,
        include: {
          room: true,
        },
      },
    );
  }

  async findOne(id: string) {
    const sensor = await this.prisma.sensor.findUnique({
      where: { id },
      include: {
        room: true,
      },
    });

    if (!sensor) {
      throw new NotFoundException(`Sensor with ID "${id}" not found`);
    }

    return sensor;
  }

  async update(id: string, dto: UpdateSensorDto) {
    await this.ensureSensorExists(id);

    if (dto.roomId) {
      await this.ensureRoomExists(dto.roomId);
    }

    return this.prisma.sensor.update({
      where: { id },
      data: {
        name: dto.name,
        tag: dto.tag,
        type: dto.type,
        unit: dto.unit,
        roomId: dto.roomId,
      },
      include: {
        room: true,
      },
    });
  }

  async remove(id: string) {
    await this.ensureSensorExists(id);

    return this.prisma.sensor.delete({
      where: { id },
    });
  }

  private async ensureSensorExists(id: string) {
    const sensor = await this.prisma.sensor.findUnique({
      where: { id },
    });

    if (!sensor) {
      throw new NotFoundException(`Sensor with ID "${id}" not found`);
    }

    return sensor;
  }

  private async ensureRoomExists(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID "${id}" not found`);
    }

    return room;
  }
}