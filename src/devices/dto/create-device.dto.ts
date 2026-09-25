import { IsIP, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateDeviceDto {

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

  @IsOptional()
  @IsString()
  protocol?: string;

  @IsOptional()
  @IsIP()
  ipAddress?: string;

  @IsString()
  deviceTypeId!: string;

  @IsString()
  roomId!: string;
}