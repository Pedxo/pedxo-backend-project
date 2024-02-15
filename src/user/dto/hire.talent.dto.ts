import { IsNotEmpty, IsString } from "class-validator";

export class HireTalentDTO{
    @IsString()
    @IsNotEmpty()
    talentId: string;

    @IsNotEmpty()
    @IsString()
    workingPeriod: string;
}