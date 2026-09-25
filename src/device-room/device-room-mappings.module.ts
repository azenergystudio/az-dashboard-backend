import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { DeviceRoomMappingsController } from './device-room-mappings.controller';
import { DeviceRoomMappingsService } from './device-room-mappings.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    DeviceRoomMappingsController,
  ],
  providers: [
    DeviceRoomMappingsService,
  ],
})
export class DeviceRoomMappingsModule {}