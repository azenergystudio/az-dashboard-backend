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

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { QueryUsersDto } from './dto/query-user.dto';

import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsList } from 'src/auth/constants/permissions';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Permissions(PermissionsList.USERS_CREATE)
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @Permissions(PermissionsList.USERS_READ)
  findAll(@Query() query: QueryUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @Permissions(PermissionsList.USERS_READ)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionsList.USERS_UPDATE)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/status')
  @Permissions(PermissionsList.USERS_UPDATE)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateStatus(id, dto);
  }

  @Delete(':id')
  @Permissions(PermissionsList.USERS_DELETE)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}