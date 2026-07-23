import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PatientsService } from './patients.service.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('patients')
@UseGuards(JwtAuthGuard) // Protège toutes les routes
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Req() req: any, @Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(req.user.clinicId, createPatientDto);
  }

  @Get()
  search(@Req() req: any, @Query('q') query: string) {
    return this.patientsService.search(req.user.clinicId, query);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.patientsService.findOne(req.user.clinicId, id);
  }
}