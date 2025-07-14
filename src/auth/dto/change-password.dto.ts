import { IsEmail, IsString } from 'class-validator';

// Parolni o'zgartirish uchun DTO: Email va yangi parolni validatsiya qiladi
export class ChangePasswordDto {
  @IsEmail({}, { message: 'Email noto\'g\'ri formatda' })
  email: string;

  @IsString({ message: 'Yangi parol matn bo\'lishi kerak' })
  newPassword: string;
}