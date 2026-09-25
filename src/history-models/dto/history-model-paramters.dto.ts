import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReplaceHistoryModelParameterDto {
  @IsString()
  @IsNotEmpty()
  parameterId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  displayOrder?: number;
}

export class ReplaceHistoryModelParametersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReplaceHistoryModelParameterDto)
  parameters!: ReplaceHistoryModelParameterDto[];
}