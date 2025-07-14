import { IsEmail } from 'class-validator';

// Parolni unutish uchun DTO: Emailni validatsiya qiladi
export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Email noto\'g\'ri formatda' })
  email: string;
}