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

import { EquipmentTypesService } from './equipment-types.service';

import { CreateEquipmentTypeDto } from './dto/create-equipment-type.dto';
import { UpdateEquipmentTypeDto } from './dto/update-equipment-type-query.dto';
import { EquipmentTypeQueryDto } from './dto/equipment-type-query.dto';

import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { PermissionsList } from 'src/auth/constants/permissions';

@Controller('equipment-types')
export class EquipmentTypesController {
  constructor(
    private readonly equipmentTypesService: EquipmentTypesService,
  ) {}

  @Post()
  @Permissions(PermissionsList.EQUIPMENT_TYPES_CREATE)
  create(@Body() dto: CreateEquipmentTypeDto) {
    return this.equipmentTypesService.create(dto);
  }

  @Get()
  @Permissions(PermissionsList.EQUIPMENT_TYPES_READ)
  findAll(@Query() query: EquipmentTypeQueryDto) {
    return this.equipmentTypesService.findAll(query);
  }

  @Get(':id')
  @Permissions(PermissionsList.EQUIPMENT_TYPES_READ)
  findOne(@Param('id') id: string) {
    return this.equipmentTypesService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionsList.EQUIPMENT_TYPES_UPDATE)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEquipmentTypeDto,
  ) {
    return this.equipmentTypesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PermissionsList.EQUIPMENT_TYPES_DELETE)
  remove(@Param('id') id: string) {
    return this.equipmentTypesService.remove(id);
  }
}