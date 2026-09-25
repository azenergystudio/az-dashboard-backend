import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { HistoryEntityType } from '../../generated/prisma/client';
import { ListQueryDto } from '../../common/dto/list-query.dto';

export class HistoryModelQueryDto extends ListQueryDto {
  @IsOptional()
  @IsEnum(HistoryEntityType)
  entityType?: HistoryEntityType;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}