import { ListQueryDto } from 'src/common/dto/list-query.dto';

export class BuildingQueryDto extends ListQueryDto {
  organizationId?: string;

  isActive?: boolean;
}