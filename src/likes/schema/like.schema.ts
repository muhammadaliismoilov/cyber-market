import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Like sxemasi: Mahsulotga yoqtirish ma'lumotlarini saqlaydi
@Schema({ timestamps: true })
export class Like extends Document {
  @Prop({ required: true, ref: 'User' })
  user_id: string;

  @Prop({ required: true, ref: 'Product' })
  product_id: string;

  @Prop({ default: false })
  isLiked: boolean;
}

export const LikeSchema = SchemaFactory.createForClass(Like);