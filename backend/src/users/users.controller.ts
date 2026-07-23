import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RegisterDto } from '../auth/dto/register.dto.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.usersService.findAll(req.user.clinicId);
  }

  @Post()
  create(@Req() req: any, @Body() registerDto: RegisterDto) {
    return this.usersService.create(req.user.clinicId, registerDto, req.user.role);
  }

  @Patch(':id/toggle')
  toggleActive(@Req() req: any, @Param('id') id: string) {
    return this.usersService.toggleActive(req.user.clinicId, id, req.user.role);
  }
}