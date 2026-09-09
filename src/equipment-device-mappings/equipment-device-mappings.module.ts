import { Module } from '@nestjs/common';
import { EquipmentDeviceMappingsController } from './equipment-device-mappings.controller';
import { EquipmentDeviceMappingsService } from './equipment-device-mappings.service';

@Module({
  controllers: [EquipmentDeviceMappingsController],
  providers: [EquipmentDeviceMappingsService]
})
export class EquipmentDeviceMappingsModule {}
