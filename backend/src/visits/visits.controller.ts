import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { VisitsService } from './visits.service.js';
import { CreateVisitDto, UpdateVisitDto } from './dto/create-visit.dto.js';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  // US-04 : Créer une visite pour un patient
@Post()
create(@Body() createVisitDto: CreateVisitDto) {
  return this.visitsService.create(
    createVisitDto.patientId as string,
    createVisitDto,
  );
}
  // US-05 : File d'attente
  @Get('queue')
  getWaitingQueue(@Query('doctorId') doctorId?: string) {
    return this.visitsService.getWaitingQueue(doctorId);
  }

  // US-07 : Historique des visites d'un patient
  @Get('patient/:patientId')
  getPatientHistory(@Param('patientId') patientId: string) {
    return this.visitsService.getPatientHistory(patientId);
  }

  // Détail d'une visite
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitsService.findOne(id);
  }

  // US-06 : Mettre à jour une visite (médecin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVisitDto: UpdateVisitDto) {
    return this.visitsService.update(id, updateVisitDto);
  }
}