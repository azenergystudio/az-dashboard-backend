import { PartialType } from '@nestjs/mapped-types';
import { CreateHistoryModelDto } from './create-history-model.dto';

export class UpdateHistoryModelDto extends PartialType(
  CreateHistoryModelDto,
) {
  parameters?: never;
}