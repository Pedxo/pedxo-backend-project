import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class FinalizeContractDto {
  // Personal Info
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  contractType: string;

  // Job Details
  @IsString()
  @IsOptional()
  roleTitle?: string;

  @IsString()
  @IsOptional()
  seniorityLevel?: string;

  @IsString()
  @IsNotEmpty()
  scopeOfWork: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsNotEmpty()
  explanationOfScopeOfWork: string;

  // Compensation
  @IsNumber()
  @IsNotEmpty()
  paymentRate: number;

  @IsString()
  @IsNotEmpty()
  paymentFrequency: string;

  // Signature (optional, may already be uploaded)
  @IsOptional()
  signature?: any;
}

