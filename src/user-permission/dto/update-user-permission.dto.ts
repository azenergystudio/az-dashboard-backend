import {
  ArrayUnique,
  IsArray,
  IsString,
} from 'class-validator';

export class UpdateUserPermissionsDto {
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  permissionIds!: string[];
}