import { Module } from '@nestjs/common';
import { VisitsService } from './visits.service.js';
import { VisitsController } from './visits.controller.js';

@Module({
  controllers: [VisitsController],
  providers: [VisitsService],
})
export class VisitsModule {}