import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { DeploymentService } from './deployment.service';

import { CreateDeploymentDto } from './dto/create-deployment.dto';
import { UpdateDeploymentDto } from './dto/update-deployment.dto';
import { DeploymentQueryDto } from './dto/deployment-query.dto';

import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsList } from '../auth/constants/permissions';

@Controller('deployments')
export class DeploymentController {
  constructor(
    private readonly deploymentService: DeploymentService,
  ) {}

  @Post()
  @Permissions(
    PermissionsList.SETTINGS_UPDATE,
  )
  create(
    @Body() dto: CreateDeploymentDto,
  ) {
    return this.deploymentService.create(dto);
  }

  @Get()
  @Permissions(
    PermissionsList.SETTINGS_READ,
  )
  findAll(
    @Query() query: DeploymentQueryDto,
  ) {
    return this.deploymentService.findAll(query);
  }

  @Get(':id')
  @Permissions(
    PermissionsList.SETTINGS_READ,
  )
  findOne(
    @Param('id') id: string,
  ) {
    return this.deploymentService.findOne(id);
  }

  @Patch(':id')
  @Permissions(
    PermissionsList.SETTINGS_UPDATE,
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDeploymentDto,
  ) {
    return this.deploymentService.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  @Permissions(
    PermissionsList.SETTINGS_UPDATE,
  )
  remove(
    @Param('id') id: string,
  ) {
    return this.deploymentService.remove(id);
  }
}