import { IsIP, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateEquipmentTypeDto {

  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}