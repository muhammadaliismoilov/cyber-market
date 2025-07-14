import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Slider sxemasi: Sarlavha, tavsif va rasmni saqlaydi
@Schema({ timestamps: true })
export class Slider extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  image: string;
}

export const SliderSchema = SchemaFactory.createForClass(Slider)