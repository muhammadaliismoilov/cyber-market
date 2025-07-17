import { IsString } from 'class-validator';

// Kategoriya yaratish uchun DTO: Kategoriya sarlavhasini validatsiya qiladi
export class CreateCategoryDto {
  @IsString({ message: 'Kategoriya sarlavhasi matn bo\'lishi kerak' })
  title: string;
}