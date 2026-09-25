import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { UpdateDeviceTypeDto } from './dto/update-device-type.dto';
import { DeviceTypeQueryDto } from './dto/device-type-query.dto';

import { buildPrismaQuery } from 'src/common/utils/prisma-query.util';
import { paginate } from 'src/common/utils/pagination.util';
import { getNextSeqNo } from 'src/common/utils/sequence.util';

@Injectable()
export class DeviceTypesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateDeviceTypeDto) {
    const exists =
      await this.prisma.deviceType.findUnique({
        where: {
          name: dto.name,
        },
      });

    if (exists) {
      throw new ConflictException(
        'Device type already exists',
      );
    }

    const seqNo = await getNextSeqNo(
      this.prisma,
      'deviceType',
    );

    return this.prisma.deviceType.create({
      data: {
        seqNo,
        ...dto,
      },
    });
  }

  async findAll(query: DeviceTypeQueryDto) {
    const prismaQuery =
      buildPrismaQuery(query, [
        'name',
        'description',
      ]);

    const [items, total] =
      await this.prisma.$transaction([
        this.prisma.deviceType.findMany(
          prismaQuery,
        ),
        this.prisma.deviceType.count({
          where: prismaQuery.where,
        }),
      ]);

    return paginate(
      items,
      total,
      query.page,
      query.limit,
    );
  }

  async findOne(id: string) {
    const deviceType =
      await this.prisma.deviceType.findUnique({
        where: { id },
      });

    if (!deviceType) {
      throw new NotFoundException(
        'Device type not found',
      );
    }

    return deviceType;
  }

  async update(
    id: string,
    dto: UpdateDeviceTypeDto,
  ) {
    await this.findOne(id);

    if (dto.name) {
      const exists =
        await this.prisma.deviceType.findFirst({
          where: {
            name: dto.name,
            NOT: { id },
          },
        });

      if (exists) {
        throw new ConflictException(
          'Device type already exists',
        );
      }
    }

    return this.prisma.deviceType.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.deviceType.delete({
      where: { id },
    });
  }
}