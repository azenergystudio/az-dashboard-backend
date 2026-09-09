import { Module } from '@nestjs/common';
import { HistoryModelsController } from './history-models.controller';
import { HistoryModelsService } from './history-models.service';

@Module({
  controllers: [HistoryModelsController],
  providers: [HistoryModelsService]
})
export class HistoryModelsModule {}
