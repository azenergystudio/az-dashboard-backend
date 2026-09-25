import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { getNextSeqNo } from 'src/common/utils/sequence.util';
import { buildPrismaQuery } from 'src/common/utils/prisma-query.util';
import { prismaPaginate } from 'src/common/utils/prisma-pagination';

import { CreateEquipmentDto } from './dto/create-equipments.dto';
import { UpdateEquipmentDto } from './dto/update-equipments.dto';
import { EquipmentQueryDto } from './dto/equipments-query.dto';

@Injectable()
export class EquipmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEquipmentDto) {
    const equipmentType = await this.prisma.equipmentType.findUnique({
      where: {
        id: dto.equipmentTypeId,
      },
    });

    if (!equipmentType) {
      throw new NotFoundException('Equipment type not found');
    }

    const room = await this.prisma.room.findUnique({
      where: {
        id: dto.roomId,
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const seqNo = await getNextSeqNo(this.prisma, 'equipment');

    return this.prisma.equipment.create({
      data: {
        seqNo,
        tag: dto.tag,
        name: dto.name,
        manufacturer: dto.manufacturer,
        model: dto.model,
        serialNumber: dto.serialNumber,
        equipmentTypeId: dto.equipmentTypeId,
        roomId: dto.roomId,
      },
      include: {
        equipmentType: {
          select: {
            id: true,
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
    });
  }

  async findAll(query: EquipmentQueryDto) {
    const prismaQuery = buildPrismaQuery(query, [
      'tag',
      'name',
      'manufacturer',
      'model',
      'serialNumber',
    ]);

    const where = prismaQuery.where;

    if (query.equipmentTypeId) {
      where.equipmentTypeId = query.equipmentTypeId;
    }

    if (query.roomId) {
      where.roomId = query.roomId;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    return prismaPaginate(this.prisma, this.prisma.equipment, {
      ...prismaQuery,
      where,
      include: {
        equipmentType: {
          select: {
            id: true,
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
    });
  }

  async findOne(id: string) {
    const equipment = await this.prisma.equipment.findUnique({
      where: {
        id,
      },
      include: {
        equipmentType: {
          select: {
            id: true,
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
        devices: {
          include: {
            device: {
              select: {
                id: true,
                tag: true,
                name: true,
                serialNumber: true,
              },
            },
          },
        },
        connectedRooms: {
          include: {
            room: {
              select: {
                id: true,
                name: true,
                roomNumber: true,
              },
            },
          },
        },
      },
    });

    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }

    return equipment;
  }

  async update(id: string, dto: UpdateEquipmentDto) {
    await this.findOne(id);

    if (dto.equipmentTypeId) {
      const equipmentType = await this.prisma.equipmentType.findUnique({
        where: {
          id: dto.equipmentTypeId,
        },
      });

      if (!equipmentType) {
        throw new NotFoundException('Equipment type not found');
      }
    }

    if (dto.roomId) {
      const room = await this.prisma.room.findUnique({
        where: {
          id: dto.roomId,
        },
      });

      if (!room) {
        throw new NotFoundException('Room not found');
      }
    }

    return this.prisma.equipment.update({
      where: {
        id,
      },
      data: {
        ...(dto.tag !== undefined && {
          tag: dto.tag,
        }),
        ...(dto.name !== undefined && {
          name: dto.name,
        }),
        ...(dto.manufacturer !== undefined && {
          manufacturer: dto.manufacturer,
        }),
        ...(dto.model !== undefined && {
          model: dto.model,
        }),
        ...(dto.serialNumber !== undefined && {
          serialNumber: dto.serialNumber,
        }),
        ...(dto.equipmentTypeId !== undefined && {
          equipmentTypeId: dto.equipmentTypeId,
        }),
        ...(dto.roomId !== undefined && {
          roomId: dto.roomId,
        }),
      },
      include: {
        equipmentType: {
          select: {
            id: true,
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
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.equipment.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
}