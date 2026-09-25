import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class AddRolePermissionDto {
  @IsString()
  @IsNotEmpty()
  permissionId!: string;
}