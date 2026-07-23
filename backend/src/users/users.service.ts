import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from '../auth/dto/register.dto.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(clinicId: string) {
    return this.prisma.user.findMany({
      where: { clinicId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(clinicId: string, registerDto: RegisterDto, currentUserRole: string) {
    // Seul un ADMIN peut créer des comptes
    if (currentUserRole !== 'ADMIN') {
      throw new ForbiddenException('Seul un administrateur peut créer des comptes.');
    }

    // Vérifier l'unicité de l'email
    const existing = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé.');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    return this.prisma.user.create({
      data: {
        clinicId,
        email: registerDto.email,
        passwordHash,
        role: registerDto.role,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async toggleActive(clinicId: string, userId: string, currentUserRole: string) {
    if (currentUserRole !== 'ADMIN') {
      throw new ForbiddenException('Seul un administrateur peut gérer les comptes.');
    }

    const user = await this.prisma.user.findFirst({
      where: { id: userId, clinicId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        isActive: true,
      },
    });
  }
}