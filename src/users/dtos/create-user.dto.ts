import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  name: string | undefined;

  @IsEmail()
  email: string | undefined;

  @IsString()
  @MinLength(8)
  password: string | undefined;

  @IsString()
  roleId: string | undefined;

  @IsOptional()
  @IsString()
  organizationId?: string;
}