// src/talents/schemas/talent-details.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ExperiencedLevel } from '../enum/talent.enum';

export type TalentDetailsDocument = TalentDetails & Document;

@Schema({ timestamps: true })
export class TalentDetails {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, unique: true })
  talentId: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  roleTitle: string;

  @Prop({ type: String, required: true })
  country: string;

  @Prop({ type: String, required: true })
  state: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true })
  gender: string;

  @Prop({ type: String, required: true })
  bankName: string;

  @Prop({ type: String, required: true })
  accountNumber: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ type: String, required: true, enum: ExperiencedLevel })
  experienceLevel: ExperiencedLevel;

  @Prop({ type: String })
  githubAccount?: string;

  @Prop({
    type: {
      linkedinAccount: { type: String },
      gitlabAccount: { type: String },
      twitterAccount: { type: String },
      facebookAccount: { type: String },
      instagramAccount: { type: String },
      tiktokAccount: { type: String },
      youtubeAccount: { type: String },
      behanceAccount: { type: String },
      dribbbleAccount: { type: String },
      other: { type: String },
    },
    default: {},
  })
  socialProfiles: {
    linkedinAccount?: string;
    gitlabAccount?: string;
    twitterAccount?: string;
    facebookAccount?: string;
    instagramAccount?: string;
    tiktokAccount?: string;
    youtubeAccount?: string;
    behanceAccount?: string;
    dribbbleAccount?: string;
    other?: string;
  };

  @Prop({ type: String, required: true })
  portfolioLink: string;

  @Prop({ type: String, required: true })
  whatsappNumber: string;

  @Prop({ type: String, required: true })
  homeAddress: string;
}

export const TalentDetailsSchema = SchemaFactory.createForClass(TalentDetails);
