import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { buildPrismaQuery } from '../common/utils/prisma-query.util';
import { getNextSeqNo } from 'src/common/utils/sequence.util';
import { prismaPaginate } from '../common/utils/prisma-pagination';
import { CreateLightingInstallationDto } from './dto/create-lighting-installation.dto';
import { UpdateLightingInstallationDto } from './dto/update-lighting-installation.dto';
import { LightingInstallationQueryDto } from './dto/lighting-installation-query.dto';

@Injectable()
export class LightingInstallationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLightingInstallationDto) {
    await this.ensureLightingExists(dto.lightingId);
    await this.ensureRoomExists(dto.roomId);

    const seqNo = await getNextSeqNo(
      this.prisma,
      'lightingInstallation',
    );

    return this.prisma.lightingInstallation.create({
      data: {
        seqNo,
        lightingId: dto.lightingId,
        roomId: dto.roomId,
        quantity: dto.quantity,
      },
      include: {
        lighting: true,
        room: true,
      },
    });
  }

  async findAll(query: LightingInstallationQueryDto) {
    const pagination = buildPrismaQuery(query, []);

    const where: Record<string, any> = {
      ...pagination.where,
    };

    if (query.lightingId) {
      where.lightingId = query.lightingId;
    }

    if (query.roomId) {
      where.roomId = query.roomId;
    }

    return prismaPaginate(
      this.prisma,
      this.prisma.lightingInstallation,
      {
        ...pagination,
        where,
        include: {
          lighting: true,
          room: true,
        },
      },
    );
  }

  async findOne(id: string) {
    const installation =
      await this.prisma.lightingInstallation.findUnique({
        where: { id },
        include: {
          lighting: true,
          room: true,
        },
      });

    if (!installation) {
      throw new NotFoundException(
        `Lighting installation with ID "${id}" not found`,
      );
    }

    return installation;
  }

  async update(
    id: string,
    dto: UpdateLightingInstallationDto,
  ) {
    await this.ensureInstallationExists(id);

    if (dto.lightingId) {
      await this.ensureLightingExists(dto.lightingId);
    }

    if (dto.roomId) {
      await this.ensureRoomExists(dto.roomId);
    }

    return this.prisma.lightingInstallation.update({
      where: { id },
      data: {
        lightingId: dto.lightingId,
        roomId: dto.roomId,
        quantity: dto.quantity,
      },
      include: {
        lighting: true,
        room: true,
      },
    });
  }

  async remove(id: string) {
    await this.ensureInstallationExists(id);

    return this.prisma.lightingInstallation.delete({
      where: { id },
    });
  }

  private async ensureInstallationExists(id: string) {
    const installation =
      await this.prisma.lightingInstallation.findUnique({
        where: { id },
      });

    if (!installation) {
      throw new NotFoundException(
        `Lighting installation with ID "${id}" not found`,
      );
    }

    return installation;
  }

  private async ensureLightingExists(id: string) {
    const lighting = await this.prisma.lighting.findUnique({
      where: { id },
    });

    if (!lighting) {
      throw new NotFoundException(
        `Lighting with ID "${id}" not found`,
      );
    }

    if (!lighting.isActive) {
      throw new NotFoundException(
        `Lighting with ID "${id}" is inactive`,
      );
    }

    return lighting;
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