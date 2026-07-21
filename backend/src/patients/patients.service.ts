import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';


// ID temporaire de la clinique pour le MVP (avant l'auth)
const DEFAULT_CLINIC_ID = 'clinic_001';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPatientDto: CreatePatientDto) {
    // Vérifier l'unicité du téléphone dans la clinique
    const existingPatient = await this.prisma.patient.findUnique({
      where: {
        clinicId_phoneNumber: {
          clinicId: DEFAULT_CLINIC_ID,
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
        clinicId: DEFAULT_CLINIC_ID,
        dateOfBirth: createPatientDto.dateOfBirth
          ? new Date(createPatientDto.dateOfBirth)
          : null,
      },
    });

    return patient;
  }

  async search(query: string) {
    const patients = await this.prisma.patient.findMany({
      where: {
        clinicId: DEFAULT_CLINIC_ID,
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
      take: 10, // Limiter à 10 résultats
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

async findOne(id: string) {
  const patient = await this.prisma.patient.findFirst({
    where: {
      id,
      clinicId: DEFAULT_CLINIC_ID,
    },
    // include sera ajouté plus tard pour les visites
  });

  if (!patient) {
    throw new NotFoundException(`Patient avec l'ID ${id} introuvable.`);
  }

  return patient;
}
}