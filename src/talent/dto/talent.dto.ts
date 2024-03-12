import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  isEnum,
} from 'class-validator';
import {
  ExperiencedLevel,
  JobNatureNeeded,
  MySkills,
  WorkPattern,
} from '../enum/talent.enum';
import { PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class CreateTalentDto {
  @IsOptional()
  @IsString()
  twitterLink: string;

  @IsOptional()
  @IsString()
  linkedIn: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsNumber()
  zipCode: number;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsEnum(MySkills, { each: true })
  skills: string[];

  @IsNotEmpty()
  @IsEnum(ExperiencedLevel)
  experiencedLevel: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsEnum(WorkPattern, { each: true })
  workPattern: string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsEnum(JobNatureNeeded, { each: true })
  jobNature: string[];

  @IsString()
  @IsOptional()
  yearOfExperienceInSales?: string;

  @IsString()
  @IsOptional()
  studentType?: string;

  @IsString()
  @IsOptional()
  nameOfSchoolOrBootCamp?: string;

  @IsString()
  @IsOptional()
  graduationDate: string[];

  @IsOptional()
  @IsString()
  image?: object;
}

export class UpdateDto extends PartialType(CreateTalentDto) {}
