import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';

// Foydalanuvchi ro'yxatdan o'tish uchun DTO: Foydalanuvchi ma'lumotlarini validatsiya qiladi
export class RegisterDto {
  @IsString({ message: 'Ism matn bo\'lishi kerak' })
  name: string;

  @IsEmail({}, { message: 'Email noto\'g\'ri formatda' })
  email: string;

  @IsString({ message: 'Telefon raqami matn bo\'lishi kerak' })
  @IsOptional()
  phone_number: string;

  @IsString({ message: 'Parol matn bo\'lishi kerak' })
  password: string;

  @IsEnum(['admin', 'user', 'superadmin'], { message: 'Rol noto\'g\'ri tanlandi' })
  @IsOptional()
  role: string;
}