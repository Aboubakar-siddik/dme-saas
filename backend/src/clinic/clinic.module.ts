import { Module } from '@nestjs/common';
import { ClinicService } from './clinic.service.js';
import { ClinicController } from './clinic.controller.js';

@Module({
  controllers: [ClinicController],
  providers: [ClinicService],
})
export class ClinicModule {}