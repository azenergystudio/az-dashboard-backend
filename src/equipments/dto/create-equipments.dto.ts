import { IsIP, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateEquipmentDto {

  @IsString()
  tag!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsString()
  equipmentTypeId!: string;

  @IsString()
  roomId!: string;
}