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

import { DeviceTypesService } from './device-types.service';

import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { UpdateDeviceTypeDto } from './dto/update-device-type.dto';
import { DeviceTypeQueryDto } from './dto/device-type-query.dto';

import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsList } from '../auth/constants/permissions';

@Controller('device-types')
export class DeviceTypesController {
  constructor(
    private readonly service: DeviceTypesService,
  ) {}

  @Post()
  @Permissions(
    PermissionsList.DEVICE_TYPES_CREATE,
  )
  create(
    @Body() dto: CreateDeviceTypeDto,
  ) {
    return this.service.create(dto);
  }

  @Get()
  @Permissions(
    PermissionsList.DEVICE_TYPES_READ,
  )
  findAll(
    @Query() query: DeviceTypeQueryDto,
  ) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Permissions(
    PermissionsList.DEVICE_TYPES_READ,
  )
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Permissions(
    PermissionsList.DEVICE_TYPES_UPDATE,
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDeviceTypeDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Permissions(
    PermissionsList.DEVICE_TYPES_DELETE,
  )
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}