import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { PermissionsService } from './permissions.service';
import { QueryPermissionsDto } from './dto/query-permissions.dto';

import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsList } from 'src/auth/constants/permissions';

@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
  ) {}

  @Get()
  @Permissions(PermissionsList.PERMISSIONS_READ)
  findAll(
    @Query() query: QueryPermissionsDto,
  ) {
    return this.permissionsService.findAll(query);
  }

  @Get(':id')
  @Permissions(PermissionsList.PERMISSIONS_READ)
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }
}