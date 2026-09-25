import { PartialType } from '@nestjs/mapped-types';
import { CreateLightingInstallationDto } from './create-lighting-installation.dto';

export class UpdateLightingInstallationDto extends PartialType(
  CreateLightingInstallationDto,
) {}