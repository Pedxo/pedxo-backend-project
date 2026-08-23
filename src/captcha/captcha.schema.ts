import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CaptchaDocument = Captcha & Document;

@Schema({ timestamps: true })
export class Captcha {
  @Prop({ required: true })
  answer: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  used: boolean;
}

export const CaptchaSchema = SchemaFactory.createForClass(Captcha);

// TTL index — MongoDB will auto-delete expired docs itself, no manual cleanup needed
CaptchaSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
