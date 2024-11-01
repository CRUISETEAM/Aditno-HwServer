import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServoDocument = Servo & Document;

@Schema({ collection: 'servo' })
export class Servo {
  @Prop({ required: true, type: String, enum: ['0', '1'] })
  status: string;
}

export const ServoSchema = SchemaFactory.createForClass(Servo);