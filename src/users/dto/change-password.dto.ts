import { IsString } from "class-validator";

export class ChangeUserPasswordDto {

  @IsString()
  currentPassword!: string;

  @IsString()
  newPassword!: string;

}