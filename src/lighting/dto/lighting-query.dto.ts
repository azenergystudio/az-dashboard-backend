import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';
import { ListQueryDto } from '../../common/dto/list-query.dto';

export class LightingQueryDto extends ListQueryDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  manufacturer?: string;
}