import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomQueryDto } from './dto/room-query.dto';

import { getNextSeqNo} from 'src/common/utils/sequence.util';
import { buildPrismaQuery } from 'src/common/utils/prisma-query.util';
import { paginate } from 'src/common/utils/pagination.util';
import { prismaPaginate } from 'src/common/utils/prisma-pagination';

@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateRoomDto) {
    const existing =
      await this.prisma.room.findFirst({
        where: {
          floorId: dto.floorId,
          roomNumber: dto.roomNumber,
        },
      });

    if (existing) {
      throw new ConflictException(
        'Room number already exists on this floor',
      );
    }

    const seqNo = await getNextSeqNo(
      this.prisma,
      'room',
    );

    return this.prisma.room.create({
      data: {
        seqNo,
        ...dto,
      },
      include: {
        floor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

async findAll(query: RoomQueryDto) {
  const prismaQuery =
    buildPrismaQuery(query, [
      'name',
      'roomNumber',
    ]);

  const where =
    prismaQuery.where;

  if (query.floorId) {
    where.floorId =
      query.floorId;
  }

  if (query.isActive !== undefined) {
    where.isActive =
      query.isActive;
  }

  return prismaPaginate(
    this.prisma,
    this.prisma.room,
    {
      ...prismaQuery,

      where,

      include: {
        floor: {
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
    const room =
      await this.prisma.room.findUnique({
        where: {
          id,
        },
        include: {
          floor: true,
        },
      });

    if (!room) {
      throw new NotFoundException(
        'Room not found',
      );
    }

    return room;
  }

  async update(
    id: string,
    dto: UpdateRoomDto,
  ) {
    await this.findOne(id);

    if (dto.roomNumber) {
      const existing =
        await this.prisma.room.findFirst({
          where: {
            roomNumber: dto.roomNumber,
            floorId: dto.floorId,
            NOT: {
              id,
            },
          },
        });

      if (existing) {
        throw new ConflictException(
          'Room number already exists',
        );
      }
    }

    return this.prisma.room.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.room.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
}