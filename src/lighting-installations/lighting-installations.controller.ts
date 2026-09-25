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
import { LightingInstallationsService } from './lighting-installations.service';
import { CreateLightingInstallationDto } from './dto/create-lighting-installation.dto';
import { UpdateLightingInstallationDto } from './dto/update-lighting-installation.dto';
import { LightingInstallationQueryDto } from './dto/lighting-installation-query.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsList } from '../auth/constants/permissions';

@Controller('lighting-installations')
export class LightingInstallationsController {
  constructor(
    private readonly lightingInstallationsService: LightingInstallationsService,
  ) {}

  @Post()
  @Permissions(PermissionsList.LIGHTING_INSTALLATIONS_CREATE)
  create(@Body() dto: CreateLightingInstallationDto) {
    return this.lightingInstallationsService.create(dto);
  }

  @Get()
  @Permissions(PermissionsList.LIGHTING_INSTALLATIONS_READ)
  findAll(@Query() query: LightingInstallationQueryDto) {
    return this.lightingInstallationsService.findAll(query);
  }

  @Get(':id')
  @Permissions(PermissionsList.LIGHTING_INSTALLATIONS_READ)
  findOne(@Param('id') id: string) {
    return this.lightingInstallationsService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionsList.LIGHTING_INSTALLATIONS_UPDATE)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLightingInstallationDto,
  ) {
    return this.lightingInstallationsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PermissionsList.LIGHTING_INSTALLATIONS_DELETE)
  remove(@Param('id') id: string) {
    return this.lightingInstallationsService.remove(id);
  }
}