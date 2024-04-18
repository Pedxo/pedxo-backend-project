import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OtpType } from '../enum/opt.type.enum';

export type OtpDocument = OTP & Document;
@Schema({ expires: 120 })
export class OTP {
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  code: string;

  @Prop({ required: true, enum: OtpType })
  type: string;

  @Prop({ default: new Date(), expires: 120 })
  createdAt: Date;

  @Prop({ default: Date.now(), expires: 120 })
  expiresAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(OTP);
