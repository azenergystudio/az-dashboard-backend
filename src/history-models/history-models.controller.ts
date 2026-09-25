import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { HistoryModelsService } from './history-models.service';

import { CreateHistoryModelDto } from './dto/create-history-model.dto';
import { UpdateHistoryModelDto } from './dto/update-history-model.dto';
import { HistoryModelQueryDto } from './dto/history-model-query.dto';
import { ReplaceHistoryModelParametersDto } from './dto/history-model-paramters.dto';

import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsList } from '../auth/constants/permissions';

@Controller('history-models')
export class HistoryModelsController {
  constructor(
    private readonly historyModelsService: HistoryModelsService,
  ) {}

  @Post()
  @Permissions(PermissionsList.HISTORY_MODELS_CREATE)
  create(@Body() dto: CreateHistoryModelDto) {
    return this.historyModelsService.create(dto);
  }

  @Get()
  @Permissions(PermissionsList.HISTORY_MODELS_READ)
  findAll(@Query() query: HistoryModelQueryDto) {
    return this.historyModelsService.findAll(query);
  }

  @Get(':id')
  @Permissions(PermissionsList.HISTORY_MODELS_READ)
  findOne(@Param('id') id: string) {
    return this.historyModelsService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionsList.HISTORY_MODELS_UPDATE)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateHistoryModelDto,
  ) {
    return this.historyModelsService.update(id, dto);
  }

  @Put(':id/parameters')
  @Permissions(PermissionsList.HISTORY_MODELS_UPDATE)
  replaceParameters(
    @Param('id') id: string,
    @Body() dto: ReplaceHistoryModelParametersDto,
  ) {
    return this.historyModelsService.replaceParameters(
      id,
      dto,
    );
  }

  @Delete(':id')
  @Permissions(PermissionsList.HISTORY_MODELS_DELETE)
  remove(@Param('id') id: string) {
    return this.historyModelsService.remove(id);
  }
}