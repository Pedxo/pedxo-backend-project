import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, isEnum } from "class-validator";
import { ExperienedLevel, JobNatureNeeded, MySkills, WorkPattern } from "../enum/talent.skills.enum";



export class BecomeTalentDTO{

    @IsOptional()
    @IsString()
    twitterLink:string;

    @IsOptional()
    @IsString()
    linkedIn:string;


    @IsOptional()
    @IsString()
    city:string;

    @IsOptional()
    @IsNumber()
    zipCode:number;


    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    @IsEnum(MySkills, { each: true })
    skills: string[];

    @IsNotEmpty()
    @IsEnum(ExperienedLevel)
    experienedLevel: ExperienedLevel;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    @IsEnum(WorkPattern, { each: true })
    workPattern:string[];

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    @IsEnum(JobNatureNeeded, { each: true })
    jobNature: string[];

    @IsString()
    @IsOptional()
    yearOfExperienceInSales?: string

    @IsString()
    @IsOptional()
    studentType?:string;

    @IsString()
    @IsOptional()
    nameOfSchoolOrBootCamp?:string;


    @IsString()
    @IsOptional()
    graduationdate:string[];

    @IsOptional()
    @IsString()
    image?:object;
}