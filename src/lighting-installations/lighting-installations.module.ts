import { Module } from '@nestjs/common';
import { LightingInstallationsController } from './lighting-installations.controller';
import { LightingInstallationsService } from './lighting-installations.service';

@Module({
  controllers: [LightingInstallationsController],
  providers: [LightingInstallationsService],
  exports: [LightingInstallationsService],
})
export class LightingInstallationsModule {}