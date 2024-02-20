import { PartialType } from "@nestjs/swagger";
import { BecomeTalentDTO } from "./create.talent.dto";

export class UpdateTalentProfileDTO extends PartialType(BecomeTalentDTO){}