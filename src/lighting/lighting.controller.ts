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
import { LightingService } from './lighting.service';
import { CreateLightingDto } from './dto/create-lighting.dto';
import { UpdateLightingDto } from './dto/update-lighting.dto';
import { LightingQueryDto } from './dto/lighting-query.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsList } from '../auth/constants/permissions';

@Controller('lighting')
export class LightingController {
  constructor(private readonly lightingService: LightingService) {}

  @Post()
  @Permissions(PermissionsList.LIGHTING_CREATE)
  create(@Body() dto: CreateLightingDto) {
    return this.lightingService.create(dto);
  }

  @Get()
  @Permissions(PermissionsList.LIGHTING_READ)
  findAll(@Query() query: LightingQueryDto) {
    return this.lightingService.findAll(query);
  }

  @Get(':id')
  @Permissions(PermissionsList.LIGHTING_READ)
  findOne(@Param('id') id: string) {
    return this.lightingService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionsList.LIGHTING_UPDATE)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLightingDto,
  ) {
    return this.lightingService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PermissionsList.LIGHTING_DELETE)
  remove(@Param('id') id: string) {
    return this.lightingService.remove(id);
  }
}