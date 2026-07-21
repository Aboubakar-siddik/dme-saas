import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Global() // Rend le PrismaService disponible dans TOUS les modules sans import explicite
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}