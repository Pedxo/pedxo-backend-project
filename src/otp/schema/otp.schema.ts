import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OtpType } from '../enum/opt.type.enum';

export type OtpDocument = OTP & Document;
@Schema({ expireAfterSeconds: 1800 })
export class OTP {
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  code: string;

  @Prop({ required: true, enum: OtpType })
  type: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: Date.now(), expireAfterSeconds: 1800 })
  expiresAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(OTP);
