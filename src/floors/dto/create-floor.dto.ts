import {
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsInt,
} from 'class-validator';

export class CreateFloorDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  floorNumber!: number;

  @IsOptional()
  @IsNumber()
  grossFloorArea?: number;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  scale?: number;

  @IsString()
  @IsNotEmpty()
  buildingId!: string;
}