import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service.js';
import { PatientsController } from './patients.controller.js';
import { ImnService } from './imn.service.js';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService, ImnService],
})
export class PatientsModule {}