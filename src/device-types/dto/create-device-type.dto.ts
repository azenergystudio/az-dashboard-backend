import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDeviceTypeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}