import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { IngestTelemetryDto, ImportTelemetryCsvDto } from './dto/create-telemetry-reading.dto';
import { LatestTelemetryQueryDto, TelemetryHistoryQueryDto } from './dto/telemetry-query.dto';
import { TelemetryService } from './telemetry.service';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  /** Ingest normalized readings from an authenticated BMS, integration, or admin workflow. */
  @Post('readings')
  ingest(@Body() dto: IngestTelemetryDto, @CurrentUser() user: JwtPayload) {
    return this.telemetryService.ingest(dto, user);
  }

  /** Import CSV text with headers: entityType, deviceId, equipmentId, parameterId, recordedAt, value, quality. */
  @Post('import/csv')
  importCsv(@Body() dto: ImportTelemetryCsvDto, @CurrentUser() user: JwtPayload) {
    return this.telemetryService.importCsv(dto.buildingId, dto.csv, user);
  }

  @Get('readings')
  history(@Query() query: TelemetryHistoryQueryDto, @CurrentUser() user: JwtPayload) {
    return this.telemetryService.history(query, user);
  }

  @Get('latest')
  latest(@Query() query: LatestTelemetryQueryDto, @CurrentUser() user: JwtPayload) {
    return this.telemetryService.latest(query, user);
  }
}
