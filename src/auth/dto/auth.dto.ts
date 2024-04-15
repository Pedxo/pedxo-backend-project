import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OtpType } from 'src/otp/enum/opt.type.enum';

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  encodedCode: string;
}

export class ForgetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class VerifyForgetPasswordDto {
  // @IsNotEmpty()
  // @IsString()
  // encodedEmail: string;

  @IsNotEmpty()
  @IsString()
  encodedCode: string;
}

export class RequestOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsEnum(OtpType)
  type: string;
}
