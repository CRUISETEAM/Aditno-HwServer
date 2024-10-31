import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SensorDocument = Sensor & Document;

@Schema()
export class Sensor {
  @Prop({ required: true, type: String, enum: ['0', '1'] })
  thereis: string;
}

export const SensorSchema = SchemaFactory.createForClass(Sensor);