import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OtpType } from 'src/otp/enum/opt.type.enum';

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsString()
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

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

// export class VerifyForgetPasswordDto {
//   @IsNotEmpty()
//   @IsString()
//   email: string;

//   @IsNotEmpty()
//   @IsString()
//   code: string;
// }

export class VerifyForgetPasswordDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}

export class RequestOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsEnum(OtpType)
  type: OtpType;
}
