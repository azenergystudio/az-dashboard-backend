import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class AddUserPermissionDto {
  @IsString()
  @IsNotEmpty()
  permissionId!: string;
}