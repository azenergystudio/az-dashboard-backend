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

import { EquipmentsService } from './equipments.service';

import { CreateEquipmentDto } from './dto/create-equipments.dto';
import { EquipmentQueryDto } from './dto/equipments-query.dto';

import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { PermissionsList } from 'src/auth/constants/permissions';
import { UpdateEquipmentDto } from './dto/update-equipments.dto';

@Controller('equipments')
export class EquipmentsController {
  constructor(private readonly equipmentsService: EquipmentsService) {}

  @Post()
  @Permissions(PermissionsList.EQUIPMENTS_CREATE)
  create(@Body() dto: CreateEquipmentDto) {
    return this.equipmentsService.create(dto);
  }

  @Get()
  @Permissions(PermissionsList.EQUIPMENTS_READ)
  findAll(@Query() query: EquipmentQueryDto) {
    return this.equipmentsService.findAll(query);
  }

  @Get(':id')
  @Permissions(PermissionsList.EQUIPMENTS_READ)
  findOne(@Param('id') id: string) {
    return this.equipmentsService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionsList.EQUIPMENTS_UPDATE)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEquipmentDto,
  ) {
    return this.equipmentsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PermissionsList.EQUIPMENTS_DELETE)
  remove(@Param('id') id: string) {
    return this.equipmentsService.remove(id);
  }
}