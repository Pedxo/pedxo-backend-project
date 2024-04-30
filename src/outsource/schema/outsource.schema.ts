import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  EmployeesCountDownEnum,
  KnowUsENum,
  NeededTeamEnum,
} from '../enum/outsource.enum';

export type OutSourceDocument = OutSource & Document;
@Schema({ timestamps: true })
export class OutSource {
  @Prop({ type: String })
  full_Name: string;

  @Prop({ type: String })
  job_title: string;

  @Prop({ type: String, required: true })
  phoneNumber: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, enum: EmployeesCountDownEnum })
  employeeCount?: EmployeesCountDownEnum;

  @Prop({ type: [String], enum: NeededTeamEnum, default: [] })
  needed_team?: NeededTeamEnum[];

  @Prop({ type: String, enum: KnowUsENum })
  knowUs?: KnowUsENum;

  @Prop({ type: String })
  project_description: string;
}

export const OutSourceSchema = SchemaFactory.createForClass(OutSource);
