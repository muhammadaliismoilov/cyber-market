import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Kategoriya sxemasi: Kategoriya ma'lumotlarini, shu jumladan rasmni saqlaydi
@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);