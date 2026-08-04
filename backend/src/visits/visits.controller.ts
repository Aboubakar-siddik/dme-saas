import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { VisitsService } from './visits.service.js';
import { CreateVisitDto, UpdateVisitDto } from './dto/create-visit.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('visits')
@UseGuards(JwtAuthGuard)
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  create(@Req() req: any, @Body() createVisitDto: CreateVisitDto) {
    return this.visitsService.create(
      req.user.clinicId,
      createVisitDto.patientId as string,
      createVisitDto,
    );
  }

  @Get('queue')
  getWaitingQueue(@Req() req: any) {
    return this.visitsService.getWaitingQueue(req.user.clinicId);
  }

  @Get('patient/:patientId')
  getPatientHistory(@Req() req: any, @Param('patientId') patientId: string) {
    return this.visitsService.getPatientHistory(req.user.clinicId, patientId);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.visitsService.findOne(req.user.clinicId, id);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() updateVisitDto: UpdateVisitDto) {
    return this.visitsService.update(req.user.clinicId, id, updateVisitDto);
  }
}