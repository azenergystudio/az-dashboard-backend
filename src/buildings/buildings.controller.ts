import { Body, Controller, Delete, Get,Param,Patch,Post,Query } from '@nestjs/common';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsList } from 'src/auth/constants/permissions';
import { BuildingQueryDto } from './dtos/building-query.dto';
import { CreateBuildingDto } from './dtos/create-building.dto';
import { UpdateBuildingDto } from './dtos/update-building.dto';
import { BuildingsService } from './buildings.service';

@Controller('buildings')
export class BuildingsController {
    constructor(
        private readonly buildingsService: BuildingsService,
    ) {}

@Get()
@Permissions(PermissionsList.BUILDINGS_READ)
findAll(@Query() query: BuildingQueryDto) {
  return this.buildingsService.findAll(query);
}

@Get(':id')
@Permissions(PermissionsList.BUILDINGS_READ)
findOne(@Param('id') id: string) {
  return this.buildingsService.findOne(id);
}

@Post()
@Permissions(PermissionsList.BUILDINGS_CREATE)
create(
  @Body() dto: CreateBuildingDto,
) {
  return this.buildingsService.create(dto);
}

@Patch(':id')
@Permissions(PermissionsList.BUILDINGS_UPDATE)
update(
  @Param('id') id: string,
  @Body() dto: UpdateBuildingDto,
) {
  return this.buildingsService.update(id, dto);
}

@Delete(':id')
@Permissions(PermissionsList.BUILDINGS_DELETE)
remove(@Param('id') id: string) {
  return this.buildingsService.remove(id);
}
}
