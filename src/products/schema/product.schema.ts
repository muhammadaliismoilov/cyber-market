import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Mahsulot sxemasi: Mahsulotning barcha xususiyatlarini, shu jumladan 4 tagacha rasmni saqlaydi
@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, ref: 'Category' })
  category_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  count: number;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  memory: string;

  @Prop({ required: false })
  screen_size: string;

  @Prop({ required: false })
  cpu: string;

  @Prop({ required: false })
  number_of_cores: number;

  @Prop({ required: false })
  main_camera: string;

  @Prop({ required: false })
  front_camera: string;

  @Prop({ required: false })
  battery_capacity: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  details: string;

  @Prop({ required: false })
  screen_resolution: string;

  @Prop({ required: false })
  screen_refresh_rate: string;

  @Prop({ required: false })
  pixel_density: string;

  @Prop({ required: false })
  screen_type: string;

  @Prop({ required: false })
  additionally: string;

  @Prop({ type: [String], default: [], validate: v => v.length <= 6 }) // Maksimum 4 rasm
  imgs: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);