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

import { DevicesService } from './devices.service';

import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceQueryDto } from './dto/device-query.dto';

import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsList } from '../auth/constants/permissions';

@Controller('devices')
export class DevicesController {
  constructor(
    private readonly service: DevicesService,
  ) {}

  @Post()
  @Permissions(
    PermissionsList.DEVICES_CREATE,
  )
  create(
    @Body() dto: CreateDeviceDto,
  ) {
    return this.service.create(dto);
  }

  @Get()
  @Permissions(
    PermissionsList.DEVICES_READ,
  )
  findAll(
    @Query() query: DeviceQueryDto,
  ) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Permissions(
    PermissionsList.DEVICES_READ,
  )
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Permissions(
    PermissionsList.DEVICES_UPDATE,
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDeviceDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Permissions(
    PermissionsList.DEVICES_DELETE,
  )
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}