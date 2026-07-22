import { IsString, MinLength, MaxLength, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum VisitStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class CreateVisitDto {
  @IsString()
  patientId?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  reason?: string;

  @IsOptional()
  @IsString()
  doctorId?: string;
}

export class UpdateVisitDto {
  @IsOptional()
  @IsString()
  observations?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  prescription?: string;

  @IsOptional()
  @IsNumber()
  fee?: number;

  @IsOptional()
  @IsEnum(VisitStatus)
  status?: VisitStatus;
}