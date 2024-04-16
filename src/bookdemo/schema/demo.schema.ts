import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  EmployeesCountDownEnum,
  KnowUsENum,
} from 'src/outsource/enum/outsource.enum';

export type BookDemoDocument = BookDemo & Document;
@Schema({ timestamps: true })
export class BookDemo {
  @Prop({ type: String })
  full_Name: string;

  @Prop({ type: String })
  job_title: string;

  @Prop({ type: String })
  company_name: string;

  @Prop({ type: String, required: true })
  phoneNumber: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, enum: EmployeesCountDownEnum })
  employeeCount?: EmployeesCountDownEnum;

  @Prop({ type: String, enum: KnowUsENum })
  knowUs?: KnowUsENum;

  @Prop({ type: Date })
  pick_date: Date;
}

export const BookDemoSchema = SchemaFactory.createForClass(BookDemo);
