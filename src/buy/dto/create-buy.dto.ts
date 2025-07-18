
import { IsMongoId, IsBoolean, IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBuyDto {

  @ApiProperty({ example: '64d3ad1a5d43f6b91b1fd3a2', description: 'Foydqalanuvchi  IDsi' })
  @IsString({ message: 'Foydqalanuvchi ID noto‘g‘ri' })
  user_id: string;

  @ApiProperty({ example: '64d3ad1a5d43f6b91b1fd3a2', description: 'Mahsulot IDsi' })
  @IsString({ message: 'Mahsulot ID noto‘g‘ri' })
  product_id: string;

  @ApiProperty({ description: 'Sonini yozing' })
  @IsNumber()
  count: number;

  @ApiProperty({
    description: "Yashash shahringiz",
    type: String,
    example: "Jizzax",
    required: false,
  })
  @IsString()
  city?: string;

  @ApiProperty({
    description: "Postal codi",
    type: String,
    example: "10001",
    required: false,
  })
  @IsString()
  postalCode?: string;

  @ApiProperty({
    description: "Mamlakatingiz",
    type: String,
    example: "Uzb",
    required: false,
  })
  @IsString()
  country?: string;
}
