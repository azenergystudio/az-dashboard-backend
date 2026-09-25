import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import {
  HistoryEntityType,
  Prisma,
} from '../generated/prisma/client';

import { CreateHistoryModelDto } from './dto/create-history-model.dto';
import { UpdateHistoryModelDto } from './dto/update-history-model.dto';
import { HistoryModelQueryDto } from './dto/history-model-query.dto';
import { ReplaceHistoryModelParametersDto } from './dto/history-model-paramters.dto';

import { buildPrismaQuery } from '../common/utils/prisma-query.util';
import { getNextSeqNo } from 'src/common/utils/sequence.util';
import { prismaPaginate } from '../common/utils/prisma-pagination';

@Injectable()
export class HistoryModelsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Validate that all supplied parameters:
   * 1. exist
   * 2. are active
   * 3. are not duplicated
   */
  private async validateParameters(
    parameters: Array<{
      parameterId: string;
      displayOrder?: number;
    }>,
  ) {
    const parameterIds = parameters.map(
      (parameter) => parameter.parameterId,
    );

    const uniqueParameterIds = new Set(parameterIds);

    if (uniqueParameterIds.size !== parameterIds.length) {
      throw new BadRequestException(
        'Duplicate parameters are not allowed',
      );
    }

    if (!parameterIds.length) {
      return;
    }

    const foundParameters = await this.prisma.parameter.findMany({
      where: {
        id: {
          in: parameterIds,
        },
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    const foundIds = new Set(
      foundParameters.map((parameter) => parameter.id),
    );

    const missingOrInactive = parameterIds.filter(
      (id) => !foundIds.has(id),
    );

    if (missingOrInactive.length) {
      throw new BadRequestException(
        `One or more parameters do not exist or are inactive: ${missingOrInactive.join(', ')}`,
      );
    }
  }

  /**
   * Return the History Model with its parameter assignments.
   */
  private readonly parameterInclude = {
    parameters: {
      orderBy: [
        {
          displayOrder: 'asc' as const,
        },
        {
          createdAt: 'asc' as const,
        },
      ],
      include: {
        parameter: true,
      },
    },
  };

  async create(dto: CreateHistoryModelDto) {
    const existing = await this.prisma.historyModel.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (existing) {
      throw new ConflictException(
        `History Model with name "${dto.name}" already exists`,
      );
    }

    const parameters = dto.parameters ?? [];

    await this.validateParameters(parameters);

    const seqNo = await getNextSeqNo(
      this.prisma,
      'historyModel',
    );

    return this.prisma.historyModel.create({
      data: {
        seqNo,
        name: dto.name,
        description: dto.description,
        entityType: dto.entityType,

        parameters: {
          create: parameters.map((parameter) => ({
            parameterId: parameter.parameterId,
            displayOrder: parameter.displayOrder,
          })),
        },
      },
      include: this.parameterInclude,
    });
  }

  async findAll(query: HistoryModelQueryDto) {
    const prismaQuery = buildPrismaQuery(query, [
      'name',
      'description',
    ]);

    const where: Prisma.HistoryModelWhereInput = {
      ...(prismaQuery.where ?? {}),
    };

    if (query.entityType !== undefined) {
      where.entityType = query.entityType;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    return prismaPaginate(
      this.prisma,
      this.prisma.historyModel,
      {
        ...prismaQuery,
        where,
        include: this.parameterInclude,
      },
    );
  }

  async findOne(id: string) {
    const historyModel =
      await this.prisma.historyModel.findUnique({
        where: {
          id,
        },
        include: this.parameterInclude,
      });

    if (!historyModel) {
      throw new NotFoundException(
        `History Model with ID "${id}" not found`,
      );
    }

    return historyModel;
  }

  async update(
    id: string,
    dto: UpdateHistoryModelDto,
  ) {
    const existing =
      await this.prisma.historyModel.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      throw new NotFoundException(
        `History Model with ID "${id}" not found`,
      );
    }

    if (dto.name && dto.name !== existing.name) {
      const duplicate =
        await this.prisma.historyModel.findUnique({
          where: {
            name: dto.name,
          },
        });

      if (duplicate) {
        throw new ConflictException(
          `History Model with name "${dto.name}" already exists`,
        );
      }
    }

    const data: Prisma.HistoryModelUpdateInput = {};

    if (dto.name !== undefined) {
      data.name = dto.name;
    }

    if (dto.description !== undefined) {
      data.description = dto.description;
    }

    if (dto.entityType !== undefined) {
      data.entityType = dto.entityType;
    }

    return this.prisma.historyModel.update({
      where: {
        id,
      },
      data,
      include: this.parameterInclude,
    });
  }

  async replaceParameters(
    id: string,
    dto: ReplaceHistoryModelParametersDto,
  ) {
    const historyModel =
      await this.prisma.historyModel.findUnique({
        where: {
          id,
        },
      });

    if (!historyModel) {
      throw new NotFoundException(
        `History Model with ID "${id}" not found`,
      );
    }

    await this.validateParameters(dto.parameters);

    await this.prisma.$transaction(async (tx) => {
      await tx.historyModelParameter.deleteMany({
        where: {
          historyModelId: id,
        },
      });

      if (dto.parameters.length) {
        await tx.historyModelParameter.createMany({
          data: dto.parameters.map((parameter) => ({
            historyModelId: id,
            parameterId: parameter.parameterId,
            displayOrder: parameter.displayOrder,
          })),
        });
      }
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    const existing =
      await this.prisma.historyModel.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      throw new NotFoundException(
        `History Model with ID "${id}" not found`,
      );
    }

    return this.prisma.historyModel.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
      include: this.parameterInclude,
    });
  }
}