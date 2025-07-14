import { IsString } from 'class-validator';

// Foydalanuvchi chiqish uchun DTO: Tokenni validatsiya qiladi
export class LogoutDto {
  @IsString({ message: 'Token matn bo\'lishi kerak' })
  token: string;
}