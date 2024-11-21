import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ThereisDocument = Thereis & Document;

@Schema({ collection: 'thereis' })
export class Thereis {
  @Prop({ required: true, type: Number, min: 1, max: 2 })
  sensorId: number;

  @Prop({ required: true, type: String })
  status: string;
}

export const ThereisSchema = SchemaFactory.createForClass(Thereis);