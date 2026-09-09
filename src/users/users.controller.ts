import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsList } from '../auth/constants/permissions';
import { Controller, Param, Query, Get, Post, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryUsersDto } from './dtos/query-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserStatusDto } from './dtos/update-user-atatus.dto';
@
Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

//   @Get()
//   @Permissions(PermissionsList.USERS_READ)
//   findAll(@Query() query: QueryUsersDto) {
//     return this.usersService.findAll(query);
//   }

  @Get(':id')
  @Permissions(PermissionsList.USERS_READ)
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

//   @Post()
//   @Permissions(PermissionsList.USERS_CREATE)
//   create(@Body() dto: CreateUserDto) {
//     return this.usersService.create(dto);
//   }

//   @Patch(':id')
//   @Permissions(PermissionsList.USERS_UPDATE)
//   update(
//     @Param('id') id: string,
//     @Body() dto: UpdateUserDto,
//   ) {
//     return this.usersService.update(id, dto);
//   }

//   @Patch(':id/status')
//   @Permissions(PermissionsList.USERS_UPDATE)
//   updateStatus(
//     @Param('id') id: string,
//     @Body() dto: UpdateUserStatusDto,
//   ) {
//     return this.usersService.updateStatus(
//       id,
//       dto.isActive,
//     );
//   }

//   @Patch(':id/password')
//   @Permissions(PermissionsList.USERS_UPDATE)
//   changePassword(
//     @Param('id') id: string,
//     @Body() dto: ChangePasswordDto,
//   ) {
//     return this.usersService.changePassword(
//       id,
//       dto.password,
//     );
//   }
}