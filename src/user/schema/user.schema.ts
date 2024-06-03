import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String })
  accessToken?: string;

  @Prop({ type: String })
  refreshToken?: string;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Boolean, default: false })
  isSuspended: boolean;

  @Prop({ type: Boolean, default: false })
  isTalent: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
