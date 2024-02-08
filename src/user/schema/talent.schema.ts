import { Prop, Schema } from "@nestjs/mongoose";
import { User } from "./user.schema";
import mongoose from "mongoose";
import { Skilled } from "../enum/talent.enum";

@Schema({timestamps: true})
export class Talent{
    @Prop({type: String})
    firstName: string;

    @Prop({type: String})
    lastName: string;
    
    @Prop({type: String})
    workEmail: string;

    @Prop({type: String})
    workPhone:string;

    @Prop({type: String})
    twitterLink:string;

    @Prop({type: String})
    city?:string;

    @Prop({type: String})
    zipCode:number;

    @Prop({type: [String], required: true})
    skills: string[];

    @Prop({type: String, enum: Skilled,  required: true})
    experienedLevel: Skilled 

    @Prop({type: String})
    workPattern:string;


    @Prop({type: mongoose.Schema.Types.ObjectId, ref: User})
    userId: User

    @Prop({type: Object})
    image:object;

    @Prop({type: Boolean, default: false})
    approved:boolean;

}