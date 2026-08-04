import { IsString, IsOptional, IsEnum, IsDateString, MinLength, MaxLength, Matches, IsBoolean } from 'class-validator';

export enum Sex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum MaritalStatus {
  SINGLE = 'CELIBATAIRE',
  MARRIED = 'MARIE',
  DIVORCED = 'DIVORCE',
  WIDOWED = 'VEUF',
}

export enum BloodGroup {
  A_POSITIVE = 'A_POSITIVE', A_NEGATIVE = 'A_NEGATIVE',
  B_POSITIVE = 'B_POSITIVE', B_NEGATIVE = 'B_NEGATIVE',
  AB_POSITIVE = 'AB_POSITIVE', AB_NEGATIVE = 'AB_NEGATIVE',
  O_POSITIVE = 'O_POSITIVE', O_NEGATIVE = 'O_NEGATIVE',
}

export class CreatePatientDto {
  @IsString() @MinLength(2) @MaxLength(50)
  firstName: string;

  @IsString() @MinLength(2) @MaxLength(50)
  lastName: string;

  @IsString() @Matches(/^[62]\d{8}$/, { message: 'Format camerounais requis' })
  phoneNumber: string;

  @IsOptional() @IsDateString()
  dateOfBirth?: string;

  @IsOptional() @IsEnum(Sex)
  sex?: Sex;

  @IsOptional() @IsEnum(BloodGroup)
  bloodGroup?: BloodGroup;

  // Nouveaux champs
  @IsOptional() @IsString() @MaxLength(100)
  profession?: string;

  @IsOptional() @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @IsOptional() @IsString() @MaxLength(50)
  nationality?: string;

  @IsOptional() @IsString() @MaxLength(50)
  countryOfOrigin?: string;

  @IsOptional() @IsString() @MaxLength(100)
  cityOfResidence?: string;

  @IsOptional() @IsString() @MaxLength(100)
  neighborhood?: string;

  @IsOptional() @IsString() @MaxLength(50)
  idCardNumber?: string;

  @IsOptional() @IsString()
  email?: string;

  @IsOptional() @IsBoolean()
  isMinor?: boolean;

  @IsOptional() @IsString()
  parentId?: string;

  // Champs médicaux
  @IsOptional() @IsString()
  allergies?: string;

  @IsOptional() @IsString()
  medicalHistory?: string;
}