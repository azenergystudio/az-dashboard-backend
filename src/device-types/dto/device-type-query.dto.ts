import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";
import { ListQueryDto } from "src/common/dto/list-query.dto";


export class DeviceTypeQueryDto extends ListQueryDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;
}