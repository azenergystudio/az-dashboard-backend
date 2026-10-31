import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { HistoryEntityType } from '../../generated/prisma/enums';

export class TelemetryHistoryQueryDto {
  @IsString()
  buildingId!: string;

  @IsEnum(HistoryEntityType)
  entityType!: HistoryEntityType;

  @IsString()
  entityId!: string;

  @IsOptional()
  @IsString()
  parameterId?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}

export class LatestTelemetryQueryDto {
  @IsString()
  buildingId!: string;

  @IsOptional()
  @IsEnum(HistoryEntityType)
  entityType?: HistoryEntityType;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsString()
  parameterId?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
