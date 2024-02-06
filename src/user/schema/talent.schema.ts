import { Prop, Schema } from "@nestjs/mongoose";
import { User } from "./user.schema";
import mongoose from "mongoose";

@Schema({timestamps: true})
export class Talent{

    @Prop({type: String})
    workEmail?: string;

    @Prop({type: String})
    workPhone?:string;

    @Prop({type: [String], required: true})
    skills: string[];

    @Prop({type: String, required: true})
    experienedLevel: string ///intermediate, expert, or junior

    @Prop({type: String, required: true})
    stateOfOrigin?:string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: User})
    userId: User

}