import { Controller, Post, Body, UseGuards, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { ForgotPasswordDto } from '../auth/dto/forgot-password.dto';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { VerifyOtpDto } from '../auth/dto/verify-otp.dto';
import { LogoutDto } from '../auth/dto/logout.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';

// Autentifikatsiya uchun controller: Ro'yxatdan o'tish, login va boshqa operatsiyalarni boshqaradi
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Foydalanuvchi ro\'yxatdan o\'tishi', description: 'Foydalanuvchi ma\'lumotlarini qabul qilib ro\'yxatdan o\'tkazadi va OTP emailga yuboriladi.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Ali' },
        email: { type: 'string', example: 'saalom dunyog@gmail.com' },
        phone_number: { type: 'string', example: '+998901234567', nullable: true },
        password: { type: 'string', example: 'passwore123' },
      },
      required: ['name', 'email', 'password'],
    },
  })
  @ApiResponse({ status: 201, description: 'Foydalanuvchi muvaffaqiyatli ro\'yxatdan o\'tdi, OTP emailga yuborildi.' })
  @ApiResponse({ status: 400, description: 'Noto\'g\'ri so\'rov, email allaqachon mavjud yoki validatsiya xatosi.' })
  @ApiResponse({ status: 409, description: 'Bu email allaqachon ro\'yxatdan o\'tgan' })
  @ApiResponse({ status: 500, description: 'Ro`yxatdan o`tishda xatolik server xatosi' })
  register(@Body() registerDto: RegisterDto) {
    try {
      return this.authService.register(registerDto);
    } catch (error) {
      throw new BadRequestException(error.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
    }
  }

  
  @Post('verify-otp')
  @ApiOperation({ summary: 'OTP tasdiqlash', description: 'Email uchun yuborilgan OTP ni tasdiqlaydi.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'salom@gmail.com' },
        otp: { type: 'string', example: '123456' },
      },
      required: ['email', 'otp'],
    },
  })
  @ApiResponse({ status: 200, description: 'OTP muvaffaqiyatli tasdiqlandi.' })
  @ApiResponse({ status: 400, description: 'Noto\'g\'ri so\'rov, OTP xato yoki eskirgan.' })
  @ApiResponse({ status: 500, description: 'OTP tasdiqlashda xatolik yuz berdi Serverda kutilmagan xatolik yuz berdi' })
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    try {
      return this.authService.verifyOtp(verifyOtpDto);
    } catch (error) {
      throw new BadRequestException(error.message || 'OTP tasdiqlashda xatolik yuz berdi');
    }
  }
  
  @Post('login')
  @ApiOperation({ summary: 'Foydalanuvchi login qilishi', description: 'Email va parol bilan login qilish va JWT token qaytarish.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'salom dunyo@gmail.com' },
        password: { type: 'string', example: 'password1234' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli login, JWT token qaytarildi.' })
  @ApiResponse({ status: 400, description: 'Noto\'g\'ri so\'rov, email yoki parol xato yoki tasdiqlanmagan.' })
  @ApiResponse({ status: 500, description: 'login qilishda serverda kutilmagan xatolik yuz berdi' })
  login(@Body() loginDto: LoginDto) {
    try {
      return this.authService.login(loginDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Login qilishda xatolik yuz berdi');
    }
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Parolni unutish', description: 'Email orqali parol tiklash uchun OTP yuborish.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'ali@gmail.com' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({ status: 200, description: 'OTP emailga muvaffaqiyatli yuborildi.' })
  @ApiResponse({ status: 400, description: 'Noto\'g\'ri so\'rov, foydalanuvchi topilmadi.' })
  @ApiResponse({ status: 500, description: 'Serverda kutilmagan xatolik yuz berdi' })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      return this.authService.forgotPassword(forgotPasswordDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Parolni unutishda xatolik yuz berdi');
    }
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Parolni o\'zgartirish', description: 'OTP bilan tasdiqlangan holda parolni o\'zgartirish.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'salom@gmail.com' },
        newPassword: { type: 'string', example: 'newpassword123' },
      },
      required: ['email', 'newPassword'],
    },
  })
  @ApiResponse({ status: 200, description: 'Parol muvaffaqiyatli o\'zgartirildi.' })
  @ApiResponse({ status: 400, description: 'Noto\'g\'ri so\'rov, foydalanuvchi topilmadi yoki tasdiqlanmagan.' })
  @ApiResponse({ status: 500, description: 'Serverda kutilmagan xatolik yuz berdi' })
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    try {
      return this.authService.changePassword(changePasswordDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Parolni o\'zgartirishda xatolik yuz berdi');
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Foydalanuvchi chiqishi', description: 'JWT token bilan chiqishni amalga oshiradi.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
      required: ['token'],
    },
  })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli chiqdingiz.' })
  @ApiResponse({ status: 400, description: 'Noto\'g\'ri so\'rov, token xato yoki yaroqsiz.' })
  @ApiResponse({ status: 500, description: 'Serverda kutilmagan xatolik yuz berdi' })
  logout(@Body() logoutDto: LogoutDto) {
    try {
      return this.authService.logout(logoutDto);
    } catch (error) {
      throw new BadRequestException(error.message || 'Chiqishda xatolik yuz berdi');
    }
  }
}