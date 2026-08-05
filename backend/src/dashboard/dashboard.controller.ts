import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getStats(@Req() req: any) {
    return this.dashboardService.getStats(req.user.clinicId);
  }

  @Get('weekly')
  getWeeklyStats(@Req() req: any) {
    return this.dashboardService.getWeeklyStats(req.user.clinicId);
}
@Get('gender')
getGenderStats(@Req() req: any) {
  return this.dashboardService.getGenderStats(req.user.clinicId);
}

@Get('age')
getAgeStats(@Req() req: any) {
  return this.dashboardService.getAgeStats(req.user.clinicId);
}

@Get('diagnosis')
getDiagnosisStats(@Req() req: any) {
  return this.dashboardService.getDiagnosisStats(req.user.clinicId);
}

@Get('trend')
getConsultationTrend(@Req() req: any) {
  return this.dashboardService.getConsultationTrend(req.user.clinicId);
}

@Get('geographic')
getGeographicStats(@Req() req: any) {
  return this.dashboardService.getGeographicStats(req.user.clinicId);
}
}