import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Skilled } from "../enum/talent.enum";

@Schema({timestamps: true})
export class Talent extends Document{
    @Prop({type: String})
    firstName?: string;

    @Prop({type: String})
    lastName?: string;
    
    @Prop({type: String})
    workEmail?: string;

    @Prop({type: String})
    workPhone:string;

    @Prop({type: String})
    twitterLink:string;

    @Prop({type: String})
    city?:string;

    @Prop({type: Number})
    zipCode:number;

    @Prop({type: [String], required: true})
    skills: string[];

    @Prop({type: String, enum: Skilled,  required: true})
    experienedLevel: Skilled 


    @Prop({type: String})
    workPattern:string;


    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userId: string;

    @Prop({type: Object, default: null})
    image?:object;

    @Prop({type: Boolean, default: false})
    approved:boolean;

    @Prop({type: Boolean, default: false})
    isTalentSuspended: boolean

}

export const TalentSchema = SchemaFactory.createForClass(Talent)