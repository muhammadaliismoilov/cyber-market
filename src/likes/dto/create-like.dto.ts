import { IsMongoId, IsBoolean } from 'class-validator';

// Like yaratish uchun DTO: Like ma'lumotlarini validatsiya qiladi
export class CreateLikeDto {
  @IsMongoId({ message: 'Foydalanuvchi ID noto\'g\'ri' })
  user_id: string;

  @IsMongoId({ message: 'Mahsulot ID noto\'g\'ri' })
  product_id: string;

  @IsBoolean({ message: 'Yoqtirish holati to\'g\'ri emas' })
  isLiked: boolean;
}