import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = OTP & Document;
@Schema({ expires: 3000 })
export class OTP {
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  code: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: Date.now(), expires: 3000 })
  expiresAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(OTP);
