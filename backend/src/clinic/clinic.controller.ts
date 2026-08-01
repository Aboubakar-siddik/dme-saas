import { Controller, Get, Post, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { ClinicService } from './clinic.service.js';
import { SetupClinicDto } from './dto/setup-clinic.dto.js';
import { UpdateClinicDto } from './dto/update-clinic.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('clinic')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  // Route publique : vérifier si configuré
  @Get('is-setup')
  isSetup() {
    return this.clinicService.isSetup();
  }

  // Route publique : configuration initiale
  @Post('setup')
  setup(@Body() setupClinicDto: SetupClinicDto) {
    return this.clinicService.setup(setupClinicDto);
  }

  // Routes protégées
  @Get('settings')
  @UseGuards(JwtAuthGuard)
  getSettings(@Req() req: any) {
    return this.clinicService.getSettings(req.user.clinicId);
  }

  @Patch('settings')
  @UseGuards(JwtAuthGuard)
  updateSettings(@Req() req: any, @Body() updateClinicDto: UpdateClinicDto) {
    return this.clinicService.updateSettings(req.user.clinicId, updateClinicDto);
  }
}