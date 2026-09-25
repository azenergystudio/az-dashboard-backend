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

import { RoomsService } from './rooms.service';

import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomQueryDto } from './dto/room-query.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';


@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
  ) {}

  @Post()
  @Permissions('room.create')
  create(
    @Body()
    dto: CreateRoomDto,
  ) {
    return this.roomsService.create(dto);
  }

  @Get()
  @Permissions('room.view')
  findAll(
    @Query()
    query: RoomQueryDto,
  ) {
    return this.roomsService.findAll(query);
  }

  @Get(':id')
  @Permissions('room.view')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('room.update')
  update(
    @Param('id')
    id: string,
    @Body()
    dto: UpdateRoomDto,
  ) {
    return this.roomsService.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  @Permissions('room.delete')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.roomsService.remove(id);
  }
}