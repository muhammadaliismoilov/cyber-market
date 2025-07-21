import { IsString, IsEmail, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';

// Foydalanuvchi yangilash uchun DTO: Foydalanuvchi ma'lumotlarini validatsiya qiladi
export class UpdateUserDto {
  @IsString({ message: 'Ism matn bo\'lishi kerak' })
  @IsOptional()
  name?: string;

  @IsEmail({}, { message: 'Email noto\'g\'ri formatda' })
  @IsNotEmpty()
  email: string;

  @IsString({ message: 'Parol matn bo\'lishi kerak' })
  @IsNotEmpty()
  password: string;

  @IsString({ message: 'Telefon raqami matn bo\'lishi kerak' })
  @IsOptional()
  phone_number?: string;

  @IsEnum(['admin', 'user', 'superadmin'], { message: 'Rol noto\'g\'ri tanlandi' })
  @IsOptional()
  role?: string;
}