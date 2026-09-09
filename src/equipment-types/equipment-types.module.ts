import { Module } from '@nestjs/common';
import { EquipmentTypesController } from './equipment-types.controller';
import { EquipmentTypesService } from './equipment-types.service';

@Module({
  controllers: [EquipmentTypesController],
  providers: [EquipmentTypesService]
})
export class EquipmentTypesModule {}
