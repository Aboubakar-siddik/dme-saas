import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SetupClinicDto } from './dto/setup-clinic.dto.js';
import { UpdateClinicDto } from './dto/update-clinic.dto.js';
import bcrypt from 'bcryptjs';

@Injectable()
export class ClinicService {
  constructor(private readonly prisma: PrismaService) {}

  // Configuration initiale (sans auth — premier lancement)
  async setup(setupClinicDto: SetupClinicDto) {
    // Vérifier si une clinique existe déjà
    const existingClinics = await this.prisma.clinic.count();
    if (existingClinics > 0) {
      throw new ConflictException('Une clinique est déjà configurée.');
    }

    // Créer la clinique
    const clinic = await this.prisma.clinic.create({
      data: {
        name: setupClinicDto.name,
        address: setupClinicDto.address,
        phone: setupClinicDto.phone,
        email: setupClinicDto.email,
        logo: setupClinicDto.logo,
      },
    });

    // Créer le compte admin
    const passwordHash = await bcrypt.hash(setupClinicDto.adminPassword, 10);
    const admin = await this.prisma.user.create({
      data: {
        clinicId: clinic.id,
        email: setupClinicDto.adminEmail,
        passwordHash,
        role: 'ADMIN',
        firstName: setupClinicDto.adminFirstName,
        lastName: setupClinicDto.adminLastName,
      },
    });

    return {
      clinic: {
        id: clinic.id,
        name: clinic.name,
      },
      admin: {
        id: admin.id,
        email: admin.email,
      },
    };
  }

  // Vérifier si la plateforme est déjà configurée
  async isSetup() {
    const count = await this.prisma.clinic.count();
    return { configured: count > 0 };
  }

  // Récupérer les paramètres
  async getSettings(clinicId: string) {
    const clinic = await this.prisma.clinic.findUnique({
      where: { id: clinicId },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        email: true,
        logo: true,
      },
    });

    if (!clinic) {
      throw new NotFoundException('Clinique introuvable.');
    }

    return clinic;
  }

  // Mettre à jour les paramètres
  async updateSettings(clinicId: string, updateClinicDto: UpdateClinicDto) {
    return this.prisma.clinic.update({
      where: { id: clinicId },
      data: updateClinicDto,
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        email: true,
        logo: true,
      },
    });
  }
}