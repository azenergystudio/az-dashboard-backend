import { IsOptional, IsString } from 'class-validator';
import { ListQueryDto } from 'src/common/dto/list-query.dto';

export class LightingInstallationQueryDto extends ListQueryDto {
  @IsOptional()
  @IsString()
  lightingId?: string;

  @IsOptional()
  @IsString()
  roomId?: string;
}