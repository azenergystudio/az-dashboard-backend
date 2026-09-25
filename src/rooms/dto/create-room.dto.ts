import { IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateRoomDto {
  @IsString()
  name!: string;

  @IsString()
  roomNumber!: string;

  @IsString()
  floorId!: string;

  @IsOptional()
  @IsInt()
  modelId?: number;

  @IsOptional()
  polygon?: any;

  @IsOptional()
  @IsNumber()
  centerX?: number;

  @IsOptional()
  @IsNumber()
  centerY?: number;
}