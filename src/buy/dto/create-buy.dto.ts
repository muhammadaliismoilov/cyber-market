
import { IsMongoId, IsBoolean, IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBuyDto {

  @ApiProperty({ example: '64d3ad1a5d43f6b91b1fd3a2', description: 'Foydqalanuvchi  IDsi' })
  @IsMongoId({ message: 'Foydqalanuvchi ID noto‘g‘ri' })
  user_id: string;

  @ApiProperty({ example: '64d3ad1a5d43f6b91b1fd3a2', description: 'Mahsulot IDsi' })
  @IsMongoId({ message: 'Mahsulot ID noto‘g‘ri' })
  product_id: string;

  @ApiProperty({ description: 'Sonini yozing' })
  @IsNumber()
  count: number;

  @ApiProperty({
    description: "Rangini koriting",
    type: String,
    example: "qora",
    required: false,
  })
  @IsString()
  color?: string;

  @ApiProperty({
    description: "Xotira hajmini kiriting",
    type: String,
    example: "64",
    required: false,
  })
  @IsString()
  memory?: string;

  // @ApiProperty({
  //   description: "Mamlakatingiz",
  //   type: String,
  //   example: "Uzb",
  //   required: false,
  // })
  // @IsString()
  // country?: string;
}
