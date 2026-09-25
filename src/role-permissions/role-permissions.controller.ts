import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { RolePermissionsService } from './role-permissions.service';

import { AddRolePermissionDto } from './dto/add-role-permissions.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';

import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsList } from 'src/auth/constants/permissions';

@Controller('role-permissions')
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  @Get()
  @Permissions(PermissionsList.ROLE_PERMISSIONS_READ)
  findAll() {
    return this.rolePermissionsService.findAll();
  }

  @Get(':roleId')
  @Permissions(PermissionsList.ROLE_PERMISSIONS_READ)
  findByRole(@Param('roleId') roleId: string) {
    return this.rolePermissionsService.findByRole(
      roleId,
    );
  }

  @Post(':roleId')
  @Permissions(PermissionsList.ROLE_PERMISSIONS_UPDATE)
  addPermission(
    @Param('roleId') roleId: string,
    @Body() dto: AddRolePermissionDto,
  ) {
    return this.rolePermissionsService.addPermission(
      roleId,
      dto,
    );
  }

  @Put(':roleId')
  @Permissions(PermissionsList.ROLE_PERMISSIONS_UPDATE)
  replacePermissions(
    @Param('roleId') roleId: string,
    @Body() dto: UpdateRolePermissionsDto,
  ) {
    return this.rolePermissionsService.replacePermissions(
      roleId,
      dto,
    );
  }

  @Delete(':roleId/:permissionId')
  @Permissions(PermissionsList.ROLE_PERMISSIONS_UPDATE)
  removePermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rolePermissionsService.removePermission(
      roleId,
      permissionId,
    );
  }
}