import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateLightingInstallationDto {
  @IsString()
  @IsNotEmpty()
  lightingId!: string;

  @IsString()
  @IsNotEmpty()
  roomId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity = 1;
}