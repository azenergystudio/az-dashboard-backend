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

import { FloorsService } from './floors.service';

import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { FloorQueryDto } from './dto/floor-query.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsList } from 'src/auth/constants/permissions';

@Controller('floors')
export class FloorsController {
  constructor(
    private readonly floorsService: FloorsService,
  ) {}

  @Post()
  @Permissions(
    PermissionsList.FLOORS_CREATE,
  )
  create(
    @Body() dto: CreateFloorDto,
  ) {
    return this.floorsService.create(dto);
  }

  @Get()
  @Permissions(
    PermissionsList.FLOORS_READ,
  )
  findAll(
    @Query() query: FloorQueryDto,
  ) {
    return this.floorsService.findAll(
      query,
    );
  }

  @Get(':id')
  @Permissions(
    PermissionsList.FLOORS_READ,
  )
  findOne(
    @Param('id') id: string,
  ) {
    return this.floorsService.findOne(id);
  }

  @Patch(':id')
  @Permissions(
    PermissionsList.FLOORS_UPDATE,
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFloorDto,
  ) {
    return this.floorsService.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  @Permissions(
    PermissionsList.FLOORS_DELETE,
  )
  remove(
    @Param('id') id: string,
  ) {
    return this.floorsService.remove(id);
  }
}