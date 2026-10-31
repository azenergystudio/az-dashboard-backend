import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { DataSource, HistoryEntityType } from '../../generated/prisma/enums';

export class TelemetryReadingItemDto {
  @IsEnum(HistoryEntityType)
  entityType!: HistoryEntityType;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsString()
  equipmentId?: string;

  @IsString()
  parameterId!: string;

  @IsDateString()
  recordedAt!: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  value!: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  quality?: string;
}

export class IngestTelemetryDto {
  @IsString()
  buildingId!: string;

  @IsOptional()
  @IsEnum(DataSource)
  source?: DataSource;

  @IsArray()
  @ArrayMaxSize(1000)
  @ValidateNested({ each: true })
  @Type(() => TelemetryReadingItemDto)
  readings!: TelemetryReadingItemDto[];
}

export class ImportTelemetryCsvDto {
  @IsString()
  buildingId!: string;

  @IsString()
  csv!: string;
}
