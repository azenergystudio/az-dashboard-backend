import {
  Body,
  Controller,
  Get,
  Param,
  Put,
} from '@nestjs/common';

import { PlatformConfigurationService } from './platform-configuration.service';

import { UpdatePlatformConfigurationDto } from './dto/update-platform-configuration.dto';

import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsList } from '../auth/constants/permissions';

@Controller('platform-configuration')
export class PlatformConfigurationController {
  constructor(
    private readonly platformConfigurationService: PlatformConfigurationService,
  ) {}

  @Get(':deploymentId')
  @Permissions(
    PermissionsList.SETTINGS_READ,
  )
  findByDeployment(
    @Param('deploymentId') deploymentId: string,
  ) {
    return this.platformConfigurationService.findByDeployment(
      deploymentId,
    );
  }

  @Put(':deploymentId')
  @Permissions(
    PermissionsList.SETTINGS_UPDATE,
  )
  update(
    @Param('deploymentId') deploymentId: string,
    @Body() dto: UpdatePlatformConfigurationDto,
  ) {
    return this.platformConfigurationService.update(
      deploymentId,
      dto,
    );
  }
}