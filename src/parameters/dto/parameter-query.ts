import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
} from 'class-validator';

import { ListQueryDto } from '../../common/dto/list-query.dto';

export class ParameterQueryDto extends ListQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}