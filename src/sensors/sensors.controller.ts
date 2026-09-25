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
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { SensorQueryDto } from './dto/sensor-query.dto';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { PermissionsList } from 'src/auth/constants/permissions';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Post()
  @Permissions(PermissionsList.SENSORS_CREATE)
  create(@Body() dto: CreateSensorDto) {
    return this.sensorsService.create(dto);
  }

  @Get()
  @Permissions(PermissionsList.SENSORS_READ)
  findAll(@Query() query: SensorQueryDto) {
    return this.sensorsService.findAll(query);
  }

  @Get(':id')
  @Permissions(PermissionsList.SENSORS_READ)
  findOne(@Param('id') id: string) {
    return this.sensorsService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PermissionsList.SENSORS_UPDATE)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSensorDto,
  ) {
    return this.sensorsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PermissionsList.SENSORS_DELETE)
  remove(@Param('id') id: string) {
    return this.sensorsService.remove(id);
  }
}