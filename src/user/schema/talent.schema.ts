import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { ExperienedLevel, JobNatureNeeded, MySkills, WorkPattern } from "../enum/talent.skills.enum";
import { User } from "./user.schema";

@Schema({timestamps: true})
export class Talent extends Document{
    @Prop({type: String})
    firstName?: string;

    @Prop({type: String})
    lastName?: string;
    
    @Prop({type: String})
    workEmail?: string;

    // @Prop({type: String})
    // workPhone:string;

    @Prop({type: String})
    twitterLink:string;

    @Prop({type: String})
    linkedIn: string

    @Prop({type: String})
    city?:string;

    @Prop({type: Number})
    zipCode:number;

    @Prop({type: [String], enum: MySkills, required: true})
    skills: MySkills[];

    @Prop({type: String, enum: ExperienedLevel,  required: true})
    experienedLevel: ExperienedLevel 

    @Prop({type: String})
    studentType?:string;

    @Prop({type: String})
    nameOfSchoolOrBootCamp?:string;


    @Prop({type: [String]})
    graduationdate:string[];

    @Prop({type: String})
    yearOfExperienceInSales: string

    @Prop({type: [String], enum: WorkPattern, required: true})
    workPattern: WorkPattern[];

    @Prop({type: [String], enum: JobNatureNeeded, required: true})
    jobNature: JobNatureNeeded[]

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userId: User;

    @Prop({type: Object, default: null})
    image?:object;

    @Prop({type: Boolean, default: false})
    approved:boolean;

    @Prop({type: Boolean, default: false})
    isTalentSuspended: boolean

}

export const TalentSchema = SchemaFactory.createForClass(Talent)