import {
  IsObject,
} from 'class-validator';

export class UpdatePlatformConfigurationDto {
  @IsObject()
  config!: Record<string, unknown>;
}