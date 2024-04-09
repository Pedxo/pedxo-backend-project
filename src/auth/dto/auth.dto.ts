import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OtpType } from 'src/otp/enum/opt.type.enum';

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  code: string;
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
}

export class VerifyForgetPasswordDto extends VerifyEmailDto {}

export class RequestOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsEnum(OtpType)
  type: string;
}
