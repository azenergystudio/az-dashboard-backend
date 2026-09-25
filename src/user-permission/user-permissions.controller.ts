import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { UserPermissionsService } from './user-permissions.service';

import { AddUserPermissionDto } from './dto/add-user-permission.dto';
import { UpdateUserPermissionsDto } from './dto/update-user-permission.dto';

import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsList } from 'src/auth/constants/permissions';

@Controller('user-permissions')
export class UserPermissionsController {
  constructor(
    private readonly userPermissionsService: UserPermissionsService,
  ) {}

  @Get()
  @Permissions(PermissionsList.USER_PERMISSIONS_READ)
  findAll() {
    return this.userPermissionsService.findAll();
  }

  @Get(':userId')
  @Permissions(PermissionsList.USER_PERMISSIONS_READ)
  findByUser(@Param('userId') userId: string) {
    return this.userPermissionsService.findByUser(
      userId,
    );
  }

  @Post(':userId')
  @Permissions(PermissionsList.USER_PERMISSIONS_UPDATE)
  addPermission(
    @Param('userId') userId: string,
    @Body() dto: AddUserPermissionDto,
  ) {
    return this.userPermissionsService.addPermission(
      userId,
      dto,
    );
  }

  @Put(':userId')
  @Permissions(PermissionsList.USER_PERMISSIONS_UPDATE)
  replacePermissions(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserPermissionsDto,
  ) {
    return this.userPermissionsService.replacePermissions(
      userId,
      dto,
    );
  }

  @Delete(':userId/:permissionId')
  @Permissions(PermissionsList.USER_PERMISSIONS_UPDATE)
  removePermission(
    @Param('userId') userId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.userPermissionsService.removePermission(
      userId,
      permissionId,
    );
  }
}