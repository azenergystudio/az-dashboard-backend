import { Module } from '@nestjs/common';
import { LightingController } from './lighting.controller';
import { LightingService } from './lighting.service';

@Module({
  controllers: [LightingController],
  providers: [LightingService],
  exports: [LightingService],
})
export class LightingModule {}