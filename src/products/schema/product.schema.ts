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

  @Prop()
  screen_size: string;

  @Prop()
  cpu: string;

  @Prop()
  number_of_cores: number;

  @Prop()
  main_camera: string;

  @Prop()
  front_camera: string;

  @Prop()
  battery_capacity: string;

  @Prop()
  description: string;

  @Prop()
  details: string;

  @Prop()
  screen_resolution: string;

  @Prop()
  screen_refresh_rate: string;

  @Prop()
  pixel_density: string;

  @Prop()
  screen_type: string;

  @Prop()
  additionally: string;

  @Prop({ type: [String], default: [], validate: v => v.length <= 6 }) // Maksimum 4 rasm
  imgs: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);