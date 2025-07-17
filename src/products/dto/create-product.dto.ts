import {
  IsString,
  IsNumber,
  IsOptional,
  IsMongoId,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ description: "Kategoriya ID", example: "64d3ad1a5d43f6b91b1fd3a1" })
  @IsMongoId({ message: "Kategoriya ID noto‘g‘ri" })
  category_id: string;

  @ApiProperty({ description: "Mahsulot nomi", example: "iPhone 15 Pro" })
  @IsString({message: "Sarlavha matn bo‘lishi kerak" })
  title: string;

  @ApiProperty({ description: "Narxi", example: 1299 })
  @IsNumber({}, { message: "Narx raqam bo‘lishi kerak" })
  @Type(() => Number)
  price: number;

  @ApiProperty({ description: "Rangi", example: "Qora" })
  @IsString({ message: "Rang matn bo‘lishi kerak" })
  color: string;

  @ApiProperty({
    description: "Xotira hajmi",
    enum: ["64","128", "256", "512", "1T", "2T"],
    example: "256"
  })
  @IsEnum(["64","128", "256", "512", "1T", "2T"], { message: "Xotira hajmi noto‘g‘ri tanlandi" })
  memory: string;

  @ApiPropertyOptional({ description: "Ekran o‘lchami", example: "6.1 inch" })
  @IsOptional()
  @IsString({ message: "Ekran o‘lchami matn bo‘lishi kerak" })
  screen_size: string;

  @ApiPropertyOptional({ description: "Protsessor", example: "A17 Bionic" })
  @IsOptional()
  @IsString({ message: "Protsessor matn bo‘lishi kerak" })
  cpu: string;

  @ApiPropertyOptional({ description: "Yadro soni", example: 8 })
  @IsOptional()
  @IsNumber({}, { message: "Yadrolar soni raqam bo‘lishi kerak" })
  @Type(() => Number)
  number_of_cores: number;

  @ApiPropertyOptional({ description: "Asosiy kamera", example: "48MP" })
  @IsOptional()
  @IsString({ message: "Asosiy kamera matn bo‘lishi kerak" })
  main_camera: string;

  @ApiPropertyOptional({ description: "Old kamera", example: "12MP" })
  @IsOptional()
  @IsString({ message: "Old kamera matn bo‘lishi kerak" })
  front_camera: string;

  @ApiPropertyOptional({ description: "Batareya sig‘imi", example: "4000mAh" })
  @IsOptional()
  @IsString({ message: "Batareya sig‘imi matn bo‘lishi kerak" })
  battery_capacity: string;

  @ApiPropertyOptional({ description: "Tavsif", example: "Zamonaviy telefon" })
  @IsOptional()
  @IsString({ message: "Tavsif matn bo‘lishi kerak" })
  description: string;

  @ApiPropertyOptional({ description: "Tafsilotlar", example: "Face ID, NFC" })
  @IsOptional()
  @IsString({ message: "Tafsilotlar matn bo‘lishi kerak" })
  details: string;

  @ApiPropertyOptional({ description: "Ekran o‘lchamlari", example: "2532 x 1170" })
  @IsOptional()
  @IsString({ message: "Ekran o‘lchamlari matn bo‘lishi kerak" })
  screen_resolution: string;

  @ApiPropertyOptional({ description: "Yangilanish tezligi", example: "120Hz" })
  @IsOptional()
  @IsString({ message: "Ekran yangilanish tezligi matn bo‘lishi kerak" })
  screen_refresh_rate: string;

  @ApiPropertyOptional({ description: "Piksel zichligi", example: "460ppi" })
  @IsOptional()
  @IsString({ message: "Piksel zichligi matn bo‘lishi kerak" })
  pixel_density: string;

  @ApiPropertyOptional({ description: "Ekran turi", example: "OLED" })
  @IsOptional()
  @IsString({ message: "Ekran turi matn bo‘lishi kerak" })
  screen_type: string;

  @ApiPropertyOptional({ description: "Qo‘shimcha ma’lumot", example: "MagSafe qo‘llab-quvvatlaydi" })
  @IsOptional()
  @IsString({ message: "Qo‘shimcha ma’lumotlar matn bo‘lishi kerak" })
  additionally: string;

  // Agar siz URL formatida saqlayotgan bo‘lsangiz, pastdagi qism kerak bo‘ladi
  @IsOptional()
  @IsArray()
  imgs: string[]; // Swaggerda fayl yuklash orqali ishlaydi
}
