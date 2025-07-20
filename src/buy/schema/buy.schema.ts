import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Buy extends Document {
  @Prop({ required: true, ref: 'User' })
  user_id: string;;

  @Prop({ required: true, ref: 'Product' })
  product_id: string;;

  @Prop({ required:true })
  count: number;

  @Prop()
  color: string;

  @Prop()
  memory: string;

}

export const BuySchema = SchemaFactory.createForClass(Buy);