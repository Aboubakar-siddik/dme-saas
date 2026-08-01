import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';

export class SetupClinicDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  // Compte admin initial
  @IsString()
  @MinLength(2)
  adminFirstName: string;

  @IsString()
  @MinLength(2)
  adminLastName: string;

  @IsEmail()
  adminEmail: string;

  @IsString()
  @MinLength(6)
  adminPassword: string;
}