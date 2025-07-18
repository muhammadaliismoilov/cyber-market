import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true, ref: 'User' })
  user_id: string;

  @Prop({ required: true, ref: 'Product' })
  product_id: string;

  @Prop({ required:true })
  comment: string;

  
}

export const CommentSchema = SchemaFactory.createForClass(Comment);