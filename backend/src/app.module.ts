import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { PatientsModule } from './patients/patients.module.js';
import { VisitsModule } from './visits/visits.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [PrismaModule, AuthModule, PatientsModule, VisitsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}