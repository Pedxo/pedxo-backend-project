import {
  IsCurrency,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { BuildSomePart, WantTalentAs, WorkStartDate } from '../enum/hire.enum';

export class HireDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  whereYouLive: string;

  @IsString()
  @IsNotEmpty()
  state: string;
  @IsString()
  @IsNotEmpty()
  country: string;
  //role)

  @IsString()
  YourTitle: string;
  ///enum
  @IsEnum(BuildSomePart)
  haveYouBuildSomePart: BuildSomePart;
  //enum
  @IsEnum(WorkStartDate)
  workStartDate: WorkStartDate;

  //enum
  @IsEnum(WantTalentAs)
  wantTalentAs: WantTalentAs;

  //background
  @IsString()
  paymentPattern: string;

  @IsString()
  yourCurrentJob: string;

  @IsNumber()
  @IsCurrency()
  minimumToPayToTalent: string;
  @IsString()
  website: string;
  @IsString()
  githubLink: string;
  @IsString()
  linkedIn: string;
  @IsString()
  twitterLink: string;
}
