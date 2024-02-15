import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({timestamps: true})
export class HireTalent extends Document{
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userId: string;

    @Prop({type: String, required: true})
    talentId: string;

    @Prop({type: Boolean, default: false})
    wasHired: boolean;
    
    @Prop({type: String, required: true})
    workingPeriod: string

}

export const HireTalentSchema= SchemaFactory.createForClass(HireTalent)