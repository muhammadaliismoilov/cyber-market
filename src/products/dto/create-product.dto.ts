import { IsString, IsNumber, IsEnum, IsMongoId, IsOptional } from 'class-validator';

// Mahsulot yaratish uchun DTO: Mahsulot maydonlarini validatsiya qiladi, rasmlar fayl sifatida yuklanadi
export class CreateProductDto {
  @IsMongoId({ message: 'Kategoriya ID noto\'g\'ri' })
  category_id: string;

  @IsString({ message: 'Sarlavha matn bo\'lishi kerak' })
  title: string;

  @IsNumber({}, { message: 'Narx raqam bo\'lishi kerak' })
  price: number;

  @IsEnum(['qizil', 'qora', 'oq', 'yashil', 'ko\'k'], { message: 'Rang noto\'g\'ri tanlandi' })
  color: string;

  @IsEnum(['128', '256', '512', '1T'], { message: 'Xotira hajmi noto\'g\'ri tanlandi' })
  memory: string;

  @IsString({ message: 'Ekran o\'lchami matn bo\'lishi kerak' })
  @IsOptional()
  screen_size: string;

  @IsString({ message: 'Protsessor matn bo\'lishi kerak' })
  @IsOptional()
  cpu: string;

  @IsNumber({}, { message: 'Yadrolar soni raqam bo\'lishi kerak' })
  @IsOptional()
  number_of_cores: number;

  @IsString({ message: 'Asosiy kamera matn bo\'lishi kerak' })
  @IsOptional()
  main_camera: string;

  @IsString({ message: 'Old kamera matn bo\'lishi kerak' })
  @IsOptional()
  front_camera: string;

  @IsString({ message: 'Batareya sig\'imi matn bo\'lishi kerak' })
  @IsOptional()
  battery_capacity: string;

  @IsString({ message: 'Tavsif matn bo\'lishi kerak' })
  @IsOptional()
  description: string;

  @IsString({ message: 'Tafsilotlar matn bo\'lishi kerak' })
  @IsOptional()
  details: string;

  @IsString({ message: 'Ekran o\'lchamlari matn bo\'lishi kerak' })
  @IsOptional()
  screen_resolution: string;

  @IsString({ message: 'Ekran yangilanish tezligi matn bo\'lishi kerak' })
  @IsOptional()
  screen_refresh_rate: string;

  @IsString({ message: 'Piksel zichligi matn bo\'lishi kerak' })
  @IsOptional()
  pixel_density: string;

  @IsString({ message: 'Ekran turi matn bo\'lishi kerak' })
  @IsOptional()
  screen_type: string;

  @IsString({ message: 'Qoshimcha ma\'lumotlar matn bo\'lishi kerak' })
  @IsOptional()
  additionally: string;

  // Rasmlar fayl sifatida yuklanadi, shuning uchun DTO da validatsiya qilinmaydi
  imgs: string[]; // Bu qator olib tashlandi
}