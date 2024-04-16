import {
  IsArray,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import {
  EmployeesCountDownEnum,
  KnowUsENum,
} from 'src/outsource/enum/outsource.enum';

export class BookDemoDto {
  @IsNotEmpty()
  @IsString()
  full_Name: string;

  @IsNotEmpty()
  @IsString()
  job_title: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  company_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsEnum(EmployeesCountDownEnum)
  employeeCount?: EmployeesCountDownEnum;

  @IsOptional()
  @IsEnum(KnowUsENum)
  knowUs?: KnowUsENum;

  @IsNotEmpty()
  @IsISO8601()
  pick_date: string;
}
