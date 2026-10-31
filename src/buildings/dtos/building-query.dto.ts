import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

import { ListQueryDto } from 'src/common/dto/list-query.dto';

export class BuildingQueryDto extends ListQueryDto {
  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}