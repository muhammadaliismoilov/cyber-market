import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Foydalanuvchi sxemasi: Foydalanuvchi ma'lumotlarini saqlaydi
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone_number: string;

  @Prop({ default: 'user', enum: ['admin', 'user', 'superadmin'] })
  role: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  otp: string;
}

export const UserSchema = SchemaFactory.createForClass(User);