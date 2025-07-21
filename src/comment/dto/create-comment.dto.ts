
import { IsMongoId, IsBoolean, IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsNotEmpty()
  @ApiProperty({ example: '64d3ad1a5d43f6b91b1fd3a2', description: 'Foydqalanuvchi  IDsi' })
  @IsMongoId({ message: 'Foydqalanuvchi ID noto‘g‘ri' })
  user_id: string;

  @IsNotEmpty()
  @ApiProperty({ example: '64d3ad1a5d43f6b91b1fd3a2', description: 'Mahsulot IDsi' })
  @IsMongoId({ message: 'Mahsulot ID noto‘g‘ri' })
  product_id: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Comment yozing' })
  @IsString()
  comment: string;
}