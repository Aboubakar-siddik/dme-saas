import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateVisitDto, UpdateVisitDto } from './dto/create-visit.dto.js';

@Injectable()
export class VisitsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(clinicId: string, patientId: string, createVisitDto: CreateVisitDto) {
  const patient = await this.prisma.patient.findFirst({
    where: { id: patientId, clinicId },
  });

  if (!patient) {
    throw new NotFoundException('Patient introuvable.');
  }

  return this.prisma.visit.create({
    data: {
      patientId,
      clinicId,
      reason: createVisitDto.reason as string,
      doctorId: createVisitDto.doctorId || null,
      status: 'WAITING',
      // Paramètres vitaux
      bloodPressure: createVisitDto.bloodPressure || null,
      heartRate: createVisitDto.heartRate || null,
      respiratoryRate: createVisitDto.respiratoryRate || null,
      oxygenSaturation: createVisitDto.oxygenSaturation || null,
      temperature: createVisitDto.temperature || null,
      weight: createVisitDto.weight || null,
      height: createVisitDto.height || null,
      bloodSugar: createVisitDto.bloodSugar || null,
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

  async getWaitingQueue(clinicId: string) {
    return this.prisma.visit.findMany({
      where: {
        clinicId,
        status: 'WAITING',
      },
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

  async findOne(clinicId: string, id: string) {
    const visit = await this.prisma.visit.findFirst({
      where: { id, clinicId },
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

  async update(clinicId: string, id: string, updateVisitDto: UpdateVisitDto) {
    const visit = await this.prisma.visit.findFirst({
      where: { id, clinicId },
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

  async getPatientHistory(clinicId: string, patientId: string) {
    return this.prisma.visit.findMany({
      where: {
        patientId,
        clinicId,
      },
      orderBy: { visitDate: 'desc' },
      take: 20,
    });
  }
}