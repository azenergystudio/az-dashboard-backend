import { Module } from '@nestjs/common';

import { PlatformConfigurationController } from './platform-configuration.controller';
import { PlatformConfigurationService } from './platform-configuration.service';

@Module({
  controllers: [
    PlatformConfigurationController,
  ],
  providers: [
    PlatformConfigurationService,
  ],
  exports: [
    PlatformConfigurationService,
  ],
})
export class PlatformConfigurationModule {}