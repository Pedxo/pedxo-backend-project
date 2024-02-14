import { Prop, Schema } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({timestamps: true})
export class HireTalent extends Document{
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userId: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Talent'})
    talentId: string;

}