import { IsString, IsOptional, IsUrl, IsNotEmpty } from 'class-validator';

// Slider yaratish uchun DTO: Sxemaga mos ravishda barcha maydonlarni validatsiya qiladi
export class CreateSliderDto {
  @IsNotEmpty()
  @IsString({ message: 'Sarlavha matn bo\'lishi kerak' })
  title: string;

  @IsString({ message: 'Tavsif matn bo\'lishi kerak' })
  description: string;

  @IsUrl({}, { message: 'Rasm uchun to\'g\'ri URL kiritilishi kerak' })
  @IsNotEmpty()
  image?: string;
}