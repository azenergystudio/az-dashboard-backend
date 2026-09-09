import {
    IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBuildingDto {
  @IsString()
  organizationId!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  buildingType?: string;

  @IsOptional()
  @IsNumber()
  grossFloorArea?: number;

  @IsOptional()
  @IsNumber()
  netFloorArea?: number;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  timezone?: string;
}