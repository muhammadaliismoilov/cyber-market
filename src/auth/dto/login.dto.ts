import { IsEmail, IsString } from 'class-validator';

// Kirish uchun DTO: Email va parolni validatsiya qiladi
export class LoginDto {
  @IsEmail({}, { message: 'Email noto\'g\'ri formatda' })
  email: string;

  @IsString({ message: 'Parol matn bo\'lishi kerak' })
  password: string;
}