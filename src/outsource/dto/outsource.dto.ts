import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { EmployeesCountDownEnum, NeededTeamEnum } from '../enum/outsource.enum';

export class OutSourceDto {
  @IsNotEmpty()
  @IsString()
  full_Name: string;

  @IsNotEmpty()
  @IsString()
  job_title: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsEnum(EmployeesCountDownEnum)
  employeeCount?: EmployeesCountDownEnum;

  @IsOptional()
  @IsArray()
  @IsEnum(NeededTeamEnum, { each: true })
  needed_team?: NeededTeamEnum;

  @IsOptional()
  @IsString()
  knowUs?: string;

  @IsNotEmpty()
  @IsString()
  project_description: string;
}
