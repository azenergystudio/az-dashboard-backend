import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from 'src/generated/prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { UpdatePlatformConfigurationDto } from './dto/update-platform-configuration.dto';

@Injectable()
export class PlatformConfigurationService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findByDeployment(
    deploymentId: string,
  ) {
    const deployment =
      await this.prisma.deployment.findUnique({
        where: {
          id: deploymentId,
        },
      });

    if (!deployment) {
      throw new NotFoundException(
        'Deployment not found',
      );
    }

    const configuration =
      await this.prisma.platformConfiguration.findUnique({
        where: {
          deploymentId,
        },
      });

    if (!configuration) {
      throw new NotFoundException(
        'Platform configuration not found',
      );
    }

    return configuration;
  }

  async update(
    deploymentId: string,
    dto: UpdatePlatformConfigurationDto,
  ) {
    const deployment =
      await this.prisma.deployment.findUnique({
        where: {
          id: deploymentId,
        },
      });

    if (!deployment) {
      throw new NotFoundException(
        'Deployment not found',
      );
    }

    const existing =
      await this.prisma.platformConfiguration.findUnique({
        where: {
          deploymentId,
        },
      });

    if (!existing) {
      return this.prisma.platformConfiguration.create({
        data: {
          deploymentId,
          config:
            dto.config as Prisma.InputJsonValue,
          version: 1,
        },
      });
    }

    return this.prisma.platformConfiguration.update({
      where: {
        deploymentId,
      },
      data: {
        config:
          dto.config as Prisma.InputJsonValue,
        version: {
          increment: 1,
        },
      },
    });
  }
}