import { IsString, IsOptional, IsNumber, IsBoolean, MinLength, MaxLength } from 'class-validator';

export enum VisitStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class CreateVisitDto {
  @IsString()
  patientId: string;

  @IsString() @MinLength(2) @MaxLength(200)
  reason: string;

  @IsOptional() @IsString()
  doctorId?: string;

  // Paramètres vitaux
  @IsOptional() @IsString()
  bloodPressure?: string;

  @IsOptional() @IsNumber()
  heartRate?: number;

  @IsOptional() @IsNumber()
  respiratoryRate?: number;

  @IsOptional() @IsNumber()
  oxygenSaturation?: number;

  @IsOptional() @IsNumber()
  temperature?: number;

  @IsOptional() @IsNumber()
  weight?: number;

  @IsOptional() @IsNumber()
  height?: number;

  @IsOptional() @IsNumber()
  bloodSugar?: number;
}

export class UpdateVisitDto {
  // Paramètres vitaux
  @IsOptional() @IsString()
  bloodPressure?: string;

  @IsOptional() @IsNumber()
  heartRate?: number;

  @IsOptional() @IsNumber()
  respiratoryRate?: number;

  @IsOptional() @IsNumber()
  oxygenSaturation?: number;

  @IsOptional() @IsNumber()
  temperature?: number;

  @IsOptional() @IsNumber()
  weight?: number;

  @IsOptional() @IsNumber()
  height?: number;

  @IsOptional() @IsNumber()
  bloodSugar?: number;

  // Consultation
  @IsOptional() @IsString()
  anamnesis?: string;

  @IsOptional() @IsBoolean()
  personalHistory?: boolean;

  @IsOptional() @IsString()
  personalHistoryDetails?: string;

  @IsOptional() @IsBoolean()
  familyHistory?: boolean;

  @IsOptional() @IsString()
  familyHistoryDetails?: string;

  @IsOptional() @IsString()
  generalSystems?: string;

  @IsOptional() @IsString()
  cardioSystems?: string;

  // Résumé
  @IsOptional() @IsString()
  observations?: string;

  @IsOptional() @IsString()
  diagnosis?: string;

  @IsOptional() @IsString()
  bilan?: string;

  @IsOptional() @IsString()
  prescription?: string;

  @IsOptional() @IsNumber()
  fee?: number;

  @IsOptional() @IsString()
  status?: VisitStatus;
}