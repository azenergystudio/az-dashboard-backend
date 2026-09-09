import { IsEmail, IsOptional, IsString } from "class-validator/types/decorator/decorators";

export class UpdateUserDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  roleId?: string;

  @IsOptional()
  @IsString()
  organizationId?: string;
}