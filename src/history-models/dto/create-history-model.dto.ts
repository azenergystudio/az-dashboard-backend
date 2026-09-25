import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HistoryEntityType } from '../../generated/prisma/client';

export class HistoryModelParameterDto {
  @IsString()
  @IsNotEmpty()
  parameterId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  displayOrder?: number;
}

export class CreateHistoryModelDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(HistoryEntityType)
  entityType!: HistoryEntityType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HistoryModelParameterDto)
  parameters?: HistoryModelParameterDto[];
}