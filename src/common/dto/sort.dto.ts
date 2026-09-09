import { IsEnum, IsOptional, IsString } from 'class-validator';

import { SortOrder } from '../enums/sort-order.enum.js';

export class SortDto {
  @IsOptional()
  @IsString()
  sortBy = 'createdAt';

  @IsOptional()
  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.DESC;
}