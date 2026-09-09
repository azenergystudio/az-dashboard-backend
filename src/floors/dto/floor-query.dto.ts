import { IsOptional, IsString } from 'class-validator';
import { ListQueryDto } from '../../common/dto/list-query.dto';

export class FloorQueryDto extends ListQueryDto {
  @IsOptional()
  @IsString()
  buildingId?: string;
}