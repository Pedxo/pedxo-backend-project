import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  region: string;

  @IsOptional()
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  level: string;
  @IsOptional()
  @IsString()
  scope: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  @IsString()
  explanation: string;

  @IsNotEmpty()
  @IsNumber()
  paymentAmount: number;

  @IsNotEmpty()
  @IsString()
  paymentFrequency: string;
}
