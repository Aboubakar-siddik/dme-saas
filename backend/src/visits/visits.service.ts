import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateVisitDto, UpdateVisitDto } from './dto/create-visit.dto.js';

const DEFAULT_CLINIC_ID = 'clinic_001';

@Injectable()
export class VisitsService {
  constructor(private readonly prisma: PrismaService) {}

  // US-04 : Créer une visite (par la secrétaire)
  async create(patientId: string, createVisitDto: CreateVisitDto) {
  const patient = await this.prisma.patient.findFirst({
    where: { id: patientId, clinicId: DEFAULT_CLINIC_ID },
  });

  if (!patient) {
    throw new NotFoundException('Patient introuvable.');
  }

  return this.prisma.visit.create({
    data: {
      patientId,
      clinicId: DEFAULT_CLINIC_ID,
      reason: createVisitDto.reason as string,
      doctorId: createVisitDto.doctorId || null,
      status: 'WAITING',
    },
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
        },
      },
    },
  });
}
  // US-05 : File d'attente du jour pour un médecin
  async getWaitingQueue(doctorId?: string) {
    const where: any = {
      clinicId: DEFAULT_CLINIC_ID,
      status: 'WAITING',
    };

    // Si un doctorId est fourni, filtrer par médecin
    if (doctorId) {
      where.doctorId = doctorId;
    }

    return this.prisma.visit.findMany({
      where,
      orderBy: { visitDate: 'asc' },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            bloodGroup: true,
            allergies: true,
          },
        },
      },
    });
  }

  // Récupérer une visite par ID
  async findOne(id: string) {
    const visit = await this.prisma.visit.findFirst({
      where: { id, clinicId: DEFAULT_CLINIC_ID },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            bloodGroup: true,
            allergies: true,
            medicalHistory: true,
          },
        },
      },
    });

    if (!visit) {
      throw new NotFoundException('Visite introuvable.');
    }

    return visit;
  }

  // US-06 : Mettre à jour une visite (observations, diagnostic, prescription)
  async update(id: string, updateVisitDto: UpdateVisitDto) {
    const visit = await this.prisma.visit.findFirst({
      where: { id, clinicId: DEFAULT_CLINIC_ID },
    });

    if (!visit) {
      throw new NotFoundException('Visite introuvable.');
    }

    return this.prisma.visit.update({
      where: { id },
      data: updateVisitDto,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // US-07 : Historique des visites d'un patient
  async getPatientHistory(patientId: string) {
    return this.prisma.visit.findMany({
      where: {
        patientId,
        clinicId: DEFAULT_CLINIC_ID,
      },
      orderBy: { visitDate: 'desc' },
      take: 20, // 20 dernières visites
    });
  }
}