import { PartialType } from '@nestjs/mapped-types';
import { CreateLightingDto } from './create-lighting.dto';

export class UpdateLightingDto extends PartialType(CreateLightingDto) {}