import { Transform, Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class QueryUsersDto {

  @IsOptional()
  @Type(() => Number)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  limit = 20;

  @IsOptional()
  search?: string;

  @IsOptional()
  roleId?: string;

  @IsOptional()
  organizationId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

}