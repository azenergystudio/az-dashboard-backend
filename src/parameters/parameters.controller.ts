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

import { ParametersService } from './parameters.service';
import { CreateParameterDto } from './dto/create-parameter.dto';
import { UpdateParameterDto } from './dto/update-parameter.dto';
import { ParameterQueryDto } from './dto/parameter-query';

import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsList } from '../auth/constants/permissions';

@Controller('parameters')
export class ParametersController {
  constructor(
    private readonly parametersService: ParametersService,
  ) {}

  @Post()
  @Permissions(PermissionsList.PARAMETERS_CREATE)
  create(@Body() dto: CreateParameterDto) {
    return this.parametersService.create(dto);
  }

  @Get()
  @Permissions(PermissionsList.PARAMETERS_READ)
  findAll(@Query() query: ParameterQueryDto) {
    return this.parametersService.findAll(query);
  }

  @Get(':id')
  @Permissions(PermissionsList.PARAMETERS_READ)
  findOne(@Param('id') id: string) {
    return this.parametersService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionsList.PARAMETERS_UPDATE)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateParameterDto,
  ) {
    return this.parametersService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PermissionsList.PARAMETERS_DELETE)
  remove(@Param('id') id: string) {
    return this.parametersService.remove(id);
  }
}