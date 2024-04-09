import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OtpType } from '../enum/opt.type.enum';

export class CreateOtpDTO {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class VerifyOTPDto extends CreateOtpDTO {}

export class SentOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(OtpType)
  @IsNotEmpty()
  type: string;
}
