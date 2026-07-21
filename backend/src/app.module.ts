import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PatientsModule } from './patients/patients.module.js';

@Module({
  imports: [PrismaModule, PatientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}