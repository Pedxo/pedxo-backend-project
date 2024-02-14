import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { Skilled } from "../enum/talent.enum";


export class BecomeTalentDTO{
    @IsPhoneNumber()
    @IsNotEmpty()
    workPhone:string;

    @IsNotEmpty()
    @IsString()
    twitterLink:string;

    @IsNotEmpty()
    @IsString()
    city:string;

    @IsNotEmpty()
    @IsNumber()
    zipCode:number;


    @IsNotEmpty()
    @IsArray()
    skills: string[];

    @IsNotEmpty()
    @IsEnum(Skilled)
    experienedLevel: Skilled;

    @IsNotEmpty()
    @IsString()
    workPattern?:string;

    @IsOptional()
    @IsString()
    image?:object;
}