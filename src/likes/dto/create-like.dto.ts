// import { IsMongoId, IsBoolean } from 'class-validator';

// // Like yaratish uchun DTO: Like ma'lumotlarini validatsiya qiladi
// export class CreateLikeDto {
//   @IsMongoId({ message: 'Foydalanuvchi ID noto\'g\'ri' })
//   user_id: string;

//   @IsMongoId({ message: 'Mahsulot ID noto\'g\'ri' })
//   product_id: string;

//   @IsBoolean({ message: 'Yoqtirish holati to\'g\'ri emas' })
//   isLiked: boolean;
// }

import { IsMongoId, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLikeDto {
  @ApiProperty({ example: '64d3ad1a5d43f6b91b1fd3a1', description: 'Foydalanuvchi IDsi' })
  @IsMongoId({ message: 'Foydalanuvchi ID noto‘g‘ri' })
  user_id: string;

  @ApiProperty({ example: '64d3ad1a5d43f6b91b1fd3a2', description: 'Mahsulot IDsi' })
  @IsMongoId({ message: 'Mahsulot ID noto‘g‘ri' })
  product_id: string;

  @ApiProperty({ example: true, description: 'Like qilinganmi yoki yo‘qmi' })
  @IsBoolean({ message: 'isLiked qiymati true yoki false bo‘lishi kerak' })
  isLiked: boolean;
}
