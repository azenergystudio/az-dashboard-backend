import { IsOptional, IsString } from 'class-validator';
import { ListQueryDto } from 'src/common/dto/list-query.dto';

export class DeviceRoomMappingQueryDto extends ListQueryDto {
  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsString()
  roomId?: string;
}