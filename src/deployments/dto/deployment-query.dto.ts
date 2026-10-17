import {
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ListQueryDto } from '../../common/dto/list-query.dto';

export class DeploymentQueryDto extends ListQueryDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  organizationId?: string;

  @IsOptional()
  environment?: string;
}