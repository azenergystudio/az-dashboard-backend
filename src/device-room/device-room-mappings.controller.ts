import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { DeviceRoomMappingsService } from './device-room-mappings.service';

import { CreateDeviceRoomMappingDto } from './dto/create-device-room-mapping.dto';
import { DeviceRoomMappingQueryDto } from './dto/device-room-mapping-query.dto';

import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsList } from '../auth/constants/permissions';

@Controller('device-room-mappings')
export class DeviceRoomMappingsController {
  constructor(
    private readonly service: DeviceRoomMappingsService,
  ) {}

  @Post()
  @Permissions(
    PermissionsList.DEVICES_CREATE,
  )
  create(
    @Body()
    dto: CreateDeviceRoomMappingDto,
  ) {
    return this.service.create(dto);
  }

  @Get()
  @Permissions(
    PermissionsList.DEVICES_READ,
  )
  findAll(
    @Query()
    query: DeviceRoomMappingQueryDto,
  ) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Permissions(
    PermissionsList.DEVICES_READ,
  )
  findOne(
    @Param('id') id: string,
  ) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @Permissions(
    PermissionsList.DEVICES_DELETE,
  )
  remove(
    @Param('id') id: string,
  ) {
    return this.service.remove(id);
  }
}