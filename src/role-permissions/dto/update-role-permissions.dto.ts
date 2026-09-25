import {
  ArrayUnique,
  IsArray,
  IsString,
} from 'class-validator';

export class UpdateRolePermissionsDto {
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  permissionIds!: string[];
}