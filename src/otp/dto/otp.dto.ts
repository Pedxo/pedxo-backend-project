import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateOtpDTO {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class VerifyOTPDto extends CreateOtpDTO { }


