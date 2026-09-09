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

import { OrganizationsService } from './organizations.service';

import { CreateOrganizationDto } from './dto/create-organization.dto';

import { OrganizationQueryDto } from './dto/organization-query.dto';

import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsList } from '../auth/constants/permissions';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
  ) {}

  @Post()
  @Permissions(PermissionsList.ORGANIZATIONS_CREATE)
  create(
    @Body() dto: CreateOrganizationDto,
  ) {
    return this.organizationsService.create(dto);
  }

  @Get()
  @Permissions(PermissionsList.ORGANIZATIONS_READ)
  findAll(
    @Query() query: OrganizationQueryDto,
  ) {
    return this.organizationsService.findAll(query);
  }

  @Get(':id')
  @Permissions(PermissionsList.ORGANIZATIONS_READ)
  findOne(
    @Param('id') id: string,
  ) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionsList.ORGANIZATIONS_UPDATE)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  @Permissions(PermissionsList.ORGANIZATIONS_DELETE)
  remove(
    @Param('id') id: string,
  ) {
    return this.organizationsService.remove(id);
  }
}