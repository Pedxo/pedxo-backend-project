import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OtpType } from '../enum/opt.type.enum';

export type OtpDocument = OTP & Document;
@Schema()
export class OTP {
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  code: string;

  @Prop({ required: true, enum: OtpType })
  type: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000),
    expires: '5m',
  })
  expiresAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(OTP);
