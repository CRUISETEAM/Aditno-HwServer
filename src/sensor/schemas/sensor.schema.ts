import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ThereisDocument = Thereis & Document;

@Schema({ collection: 'thereis' })
export class Thereis {
  @Prop({ required: true, type: String, enum: ['0', '1'] })
  status: string;
}

export const ThereisSchema = SchemaFactory.createForClass(Thereis);