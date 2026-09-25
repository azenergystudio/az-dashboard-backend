import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { ListQueryDto } from "src/common/dto/list-query.dto";

export class RoomQueryDto extends ListQueryDto {
  @IsOptional()
  @IsString()
  floorId?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}