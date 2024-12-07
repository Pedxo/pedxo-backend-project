import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { OtpType } from '../enum/opt.type.enum';

export class CreateOtpDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsEnum(OtpType)
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}

export class VerifyOTPDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsEnum(OtpType)
  @IsNotEmpty()
  type: OtpType;
}

export class ValidateOtpDto extends VerifyOTPDto {}

export class SentOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(OtpType)
  @IsNotEmpty()
  type: OtpType;
}
