import { IsEmail, IsString } from 'class-validator';

// OTP tasdiqlash uchun DTO: Email va OTP kodni validatsiya qiladi
export class VerifyOtpDto {
  @IsEmail({}, { message: 'Email noto\'g\'ri formatda' })
  email: string;

  @IsString({ message: 'OTP kod matn bo\'lishi kerak' })
  otp: string;
}