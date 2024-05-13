import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
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

// export class VerifyOTPDto {
//   @IsNotEmpty()
//   @IsEmail()
//   email: string;

//   @IsNotEmpty()
//   @IsString()
//   code: string;
// }

export class VerifyOTPDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}

export class SentOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(OtpType)
  @IsNotEmpty()
  type: string;

  @IsEmail()
  @IsNotEmpty()
  userName: string;
}
