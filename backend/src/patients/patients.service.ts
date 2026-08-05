import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(clinicId: string, createPatientDto: CreatePatientDto) {
    const existingPatient = await this.prisma.patient.findUnique({
      where: {
        clinicId_phoneNumber: {
          clinicId: clinicId,
          phoneNumber: createPatientDto.phoneNumber,
        },
      },
    });

    if (existingPatient) {
      throw new ConflictException(
        `Un patient avec le numéro ${createPatientDto.phoneNumber} existe déjà.`,
      );
    }

    
    // Créer le patient
    const patient = await this.prisma.patient.create({
      data: {
        ...createPatientDto,
        clinicId: clinicId,
        dateOfBirth: createPatientDto.dateOfBirth
          ? new Date(createPatientDto.dateOfBirth)
          : null,
      },
    });

    return patient;
  }

  async search(clinicId: string, query: string) {
    const patients = await this.prisma.patient.findMany({
      where: {
        clinicId: clinicId,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { phoneNumber: { contains: query } },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        dateOfBirth: true,
        sex: true,
        bloodGroup: true,
      },
      take: 10,
      orderBy: { lastName: 'asc' },
    });

    return {
      data: patients,
      meta: {
        total: patients.length,
        query,
      },
    };
  }

  async findOne(clinicId: string, id: string) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id,
        clinicId: clinicId,
      },
    });

    if (!patient) {
      throw new NotFoundException(`Patient avec l'ID ${id} introuvable.`);
    }

    return patient;
  }
  async update(clinicId: string, id: string, updatePatientDto: Partial<CreatePatientDto>) {
    const patient = await this.prisma.patient.findFirst({
      where: { id, clinicId },
    });

    if (!patient) {
      throw new NotFoundException('Patient introuvable.');
    }

    return this.prisma.patient.update({
      where: { id },
      data: {
        ...updatePatientDto,
        dateOfBirth: updatePatientDto.dateOfBirth
          ? new Date(updatePatientDto.dateOfBirth)
          : undefined,
      },
    });
  }
} 


