import { IsNotEmpty, IsString } from "class-validator";

export class HireTalentDTO{
    @IsNotEmpty()
    @IsString()
    workingPeriod: string;
}