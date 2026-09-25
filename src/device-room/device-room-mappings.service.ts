import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateDeviceRoomMappingDto } from './dto/create-device-room-mapping.dto';
import { DeviceRoomMappingQueryDto } from './dto/device-room-mapping-query.dto';

import { buildPrismaQuery } from 'src/common/utils/prisma-query.util';
import { paginate } from 'src/common/utils/pagination.util';
import { getNextSeqNo } from 'src/common/utils/sequence.util';

@Injectable()
export class DeviceRoomMappingsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    dto: CreateDeviceRoomMappingDto,
  ) {
    const exists =
      await this.prisma.deviceRoomMapping.findFirst({
        where: {
          deviceId: dto.deviceId,
          roomId: dto.roomId,
        },
      });

    if (exists) {
      throw new ConflictException(
        'Mapping already exists',
      );
    }

    const seqNo =
      await getNextSeqNo(
        this.prisma,
        'deviceRoomMapping',
      );

    return this.prisma.deviceRoomMapping.create({
      data: {
        seqNo,
        ...dto,
      },
      include: {
        device: true,
        room: true,
      },
    });
  }

  async findAll(
    query: DeviceRoomMappingQueryDto,
  ) {
    const prismaQuery =
      buildPrismaQuery(query);

    const where: any =
      prismaQuery.where;

    if (query.deviceId) {
      where.deviceId =
        query.deviceId;
    }

    if (query.roomId) {
      where.roomId =
        query.roomId;
    }

    const [items, total] =
      await this.prisma.$transaction([
        this.prisma.deviceRoomMapping.findMany({
          ...prismaQuery,
          where,
          include: {
            device: {
              select: {
                id: true,
                tag: true,
                name: true,
              },
            },
            room: {
              select: {
                id: true,
                name: true,
                roomNumber: true,
              },
            },
          },
        }),

        this.prisma.deviceRoomMapping.count({
          where,
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
    const mapping =
      await this.prisma.deviceRoomMapping.findUnique({
        where: {
          id,
        },
        include: {
          device: true,
          room: true,
        },
      });

    if (!mapping) {
      throw new NotFoundException(
        'Mapping not found',
      );
    }

    return mapping;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.deviceRoomMapping.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Mapping deleted successfully',
    };
  }
}