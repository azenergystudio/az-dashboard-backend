import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceQueryDto } from './dto/device-query.dto';

import { buildPrismaQuery } from 'src/common/utils/prisma-query.util';
import { paginate } from 'src/common/utils/pagination.util';
import { getNextSeqNo } from 'src/common/utils/sequence.util';
import { prismaPaginate } from 'src/common/utils/prisma-pagination';

@Injectable()
export class DevicesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateDeviceDto) {
    if (dto.serialNumber) {
      const serial =
        await this.prisma.device.findUnique({
          where: {
            serialNumber: dto.serialNumber,
          },
        });

      if (serial) {
        throw new ConflictException(
          'Serial number already exists',
        );
      }
    }

    const seqNo = await getNextSeqNo(
      this.prisma,
      'device',
    );

    return this.prisma.device.create({
      data: {
        seqNo,
        ...dto,
      },
      include: {
        room: true,
        deviceType: true,
      },
    });
  }

async findAll(query: DeviceQueryDto) {
  const prismaQuery =
    buildPrismaQuery(query, [
      'tag',
      'name',
      'manufacturer',
      'model',
      'serialNumber',
    ]);

  const where =
    prismaQuery.where;

  if (query.roomId) {
    where.roomId =
      query.roomId;
  }

  if (query.deviceTypeId) {
    where.deviceTypeId =
      query.deviceTypeId;
  }

  if (query.isActive !== undefined) {
    where.isActive =
      query.isActive;
  }

  return prismaPaginate(
    this.prisma,
    this.prisma.device,
    {
      ...prismaQuery,

      where,

      include: {
        deviceType: {
          select: {
            id: true,
            name: true,
          },
        },

        room: {
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
    const device =
      await this.prisma.device.findUnique({
        where: { id },
        include: {
          room: true,
          deviceType: true,
        },
      });

    if (!device) {
      throw new NotFoundException(
        'Device not found',
      );
    }

    return device;
  }

  async update(
    id: string,
    dto: UpdateDeviceDto,
  ) {
    await this.findOne(id);

    if (dto.serialNumber) {
      const exists =
        await this.prisma.device.findFirst({
          where: {
            serialNumber:
              dto.serialNumber,
            NOT: { id },
          },
        });

      if (exists) {
        throw new ConflictException(
          'Serial number already exists',
        );
      }
    }

    return this.prisma.device.update({
      where: { id },
      data: dto,
      include: {
        room: true,
        deviceType: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.device.delete({
      where: { id },
    });
  }
}