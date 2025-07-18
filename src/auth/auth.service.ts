// import { Injectable, BadRequestException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User } from '../users/schema/user.schema';
// import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';
// import { ForgotPasswordDto } from './dto/forgot-password.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { VerifyOtpDto } from './dto/verify-otp.dto';
// import { LogoutDto } from './dto/logout.dto';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import * as nodemailer from 'nodemailer';

// // Autentifikatsiya xizmatlari: Ro'yxatdan o'tish, login, chiqish va boshqa operatsiyalarni boshqaradi
// @Injectable()
// export class AuthService {
//   private transporter: nodemailer.Transporter;

//   constructor(
//     @InjectModel(User.name) private userModel: Model<User>,
//     private jwtService: JwtService,
//     private configService: ConfigService,
//   ) {
//     // Nodemailer konfiguratsiyasi: Email xizmatini sozlash
//     this.transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: this.configService.get<string>('EMAIL_USER'),
//         pass: this.configService.get<string>('EMAIL_PASS'),
//       },
//     });
//   }

//   // Foydalanuvchi ro'yxatdan o'tkazish
//   async register(registerDto: RegisterDto): Promise<{ message: string }> {
//     try {
//       const { email, role } = registerDto;
//       const existingUser = await this.userModel.findOne({ email }).exec();
//       if (existingUser) {
//         throw new BadRequestException('Bu email allaqachon ro\'yxatdan o\'tgan');
//       }

//       const otp = Math.floor(100000 + Math.random() * 900000).toString();
//       const userData = {
//         ...registerDto,
//         role: role || 'user', // Agar role kiritilmagan bo'lsa, default "user" qo'yiladi
//         otp,
//         isVerified: false,
//       };

//       const user = await this.userModel.create(userData);

//       // OTP ni email orqali yuborish
//       await this.transporter.sendMail({
//         from: this.configService.get<string>('EMAIL_USER'),
//         to: email,
//         subject: 'Ro\'yxatdan o\'tish uchun tasdiqlash kodi',
//         text: `Sizning tasdiqlash kodingiz: ${otp}`,
//       });

//       return { message: 'Foydalanuvchi ro\'yxatdan o\'tdi, OTP emailga yuborildi' };
//     } catch (error) {
//       throw new BadRequestException('Ro\'yxatdan o\'tishda xatolik yuz berdi');
//     }
//   }

//   async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
//     try {
//       const { email, otp } = verifyOtpDto;
//       const user = await this.userModel.findOne({ email, otp }).exec();
//       if (!user) {
//         throw new BadRequestException('OTP noto\'g\'ri yoki eskirgan');
//       }

//       user.isVerified = true;
//       user.otp = ''; // OTP ni o'chirish
//       await user.save();

//       return { message: 'Email muvaffaqiyatli tasdiqlandi' };
//     } catch (error) {
//       throw new BadRequestException('OTP tasdiqlashda xatolik yuz berdi');
//     }
//   }

//   // Login qilish
//   async login(loginDto: LoginDto): Promise<{ access_token: string }> {
//     try {
//       const { email, password } = loginDto;
//       const user = await this.userModel.findOne({ email, password }).exec();
//       if (!user || !user.isVerified) {
//         throw new BadRequestException('Email yoki parol noto\'g\'ri yoki tasdiqlanmagan');
//       }

//       const payload = { sub: user._id, email: user.email, name: user.name, role: user.role };
//       return { access_token: this.jwtService.sign(payload) };
//     } catch (error) {
//       throw new BadRequestException('Login qilishda xatolik yuz berdi');
//     }
//   }

//   // OTP tasdiqlash

//   // Parolni unutish
//   async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
//     try {
//       const { email } = forgotPasswordDto;
//       const user = await this.userModel.findOne({ email }).exec();
//       if (!user) {
//         throw new BadRequestException('Foydalanuvchi topilmadi');
//       }

//       const otp = Math.floor(100000 + Math.random() * 900000).toString();
//       user.otp = otp;
//       await user.save();

//       await this.transporter.sendMail({
//         from: this.configService.get<string>('EMAIL_USER'),
//         to: email,
//         subject: 'Parolni tiklash uchun tasdiqlash kodi',
//         text: `Sizning tasdiqlash kodingiz: ${otp}`,
//       });

//       return { message: 'OTP emailga yuborildi' };
//     } catch (error) {
//       throw new BadRequestException('Parolni unutishda xatolik yuz berdi');
//     }
//   }

//   // Parolni o'zgartirish
//   async changePassword(changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
//     try {
//       const { email, newPassword } = changePasswordDto;
//       const user = await this.userModel.findOne({ email }).exec();
//       if (!user || !user.isVerified) {
//         throw new BadRequestException('Foydalanuvchi topilmadi yoki tasdiqlanmagan');
//       }

//       user.password = newPassword;
//       user.otp = ''; // OTP ni o'chirish
//       await user.save();

//       return { message: 'Parol muvaffaqiyatli o\'zgartirildi' };
//     } catch (error) {
//       throw new BadRequestException('Parolni o\'zgartirishda xatolik yuz berdi');
//     }
//   }

//   // Chiqish (Logout)
//   async logout(logoutDto: LogoutDto): Promise<{ message: string }> {
//     try {
//       const { token } = logoutDto;
//       return { message: 'Muvaffaqiyatli chiqdingiz' };
//     } catch (error) {
//       throw new BadRequestException('Chiqishda xatolik yuz berdi');
//     }
//   }
// }


import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schema/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LogoutDto } from './dto/logout.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

// Autentifikatsiya xizmatlari: Ro'yxatdan o'tish, login, chiqish va boshqa operatsiyalarni boshqaradi
@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Nodemailer konfiguratsiyasi: Email xizmatini sozlash
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  // Foydalanuvchi ro'yxatdan o'tkazish
  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    try {
      const { email, password, role } = registerDto;
      const existingUser = await this.userModel.findOne({ email }).exec();
      if (existingUser) {
        throw new BadRequestException('Bu email allaqachon ro\'yxatdan o\'tgan');
      }

      // Parolni bcrypt bilan hash qilish
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const userData = {
        ...registerDto,
        password: hashedPassword, // Hashlangan parolni saqlash
        role: role || 'user', // Agar role kiritilmagan bo'lsa, default "user" qo'yiladi
        otp,
        isVerified: false,
      };

      const user = await this.userModel.create(userData);

      // OTP ni email orqali yuborish
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_USER'),
        to: email,
        subject: 'Ro\'yxatdan o\'tish uchun tasdiqlash kodi',
        text: `Sizning tasdiqlash kodingiz: ${otp}`,
      });

      return { message: 'Foydalanuvchi ro\'yxatdan o\'tdi, OTP emailga yuborildi' };
    } catch (error) {
      throw new BadRequestException('Ro\'yxatdan o\'tishda xatolik yuz berdi: ' + error.message);
    }
  }

  // OTP tasdiqlash
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
    try {
      const { email, otp } = verifyOtpDto;
      const user = await this.userModel.findOne({ email, otp }).exec();
      if (!user) {
        throw new BadRequestException('OTP noto\'g\'ri yoki eskirgan');
      }

      user.isVerified = true;
      user.otp = ''; // OTP ni o'chirish
      await user.save();

      return { message: 'Email muvaffaqiyatli tasdiqlandi' };
    } catch (error) {
      throw new BadRequestException('OTP tasdiqlashda xatolik yuz berdi: ' + error.message);
    }
  }

  // Login qilish
  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    try {
      const { email, password } = loginDto;
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        throw new UnauthorizedException('Email noto\'g\'ri');
      }
      if (!user.isVerified) {
        throw new UnauthorizedException('Foydalanuvchi tasdiqlanmagan');
      }
      if (!(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Parol noto\'g\'ri');
      }

      const payload = { sub: user._id, email: user.email, name: user.name, role: user.role };
      console.log('Payload:', payload);
      console.log('JWT_SECRET:', this.configService.get<string>('JWT_SECRET'));
      return {
        access_token: this.jwtService.sign(payload, {
          secret: this.configService.get<string>('JWT_SECRET'),
        }),
      };
    } catch (error) {
      throw new UnauthorizedException('Login qilishda xatolik yuz berdi: ' + error.message);
    }
  }

  // Parolni unutish
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    try {
      const { email } = forgotPasswordDto;
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        throw new BadRequestException('Foydalanuvchi topilmadi');
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      await user.save();

      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_USER'),
        to: email,
        subject: 'Parolni tiklash uchun tasdiqlash kodi',
        text: `Sizning tasdiqlash kodingiz: ${otp}`,
      });

      return { message: 'OTP emailga yuborildi' };
    } catch (error) {
      throw new BadRequestException('Parolni unutishda xatolik yuz berdi: ' + error.message);
    }
  }

  // Parolni o'zgartirish
  async changePassword(changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    try {
      const { email, newPassword } = changePasswordDto;
      const user = await this.userModel.findOne({ email }).exec();
      if (!user || !user.isVerified) {
        throw new BadRequestException('Foydalanuvchi topilmadi yoki tasdiqlanmagan');
      }

      // Yangi parolni hash qilish
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;
      user.otp = ''; // OTP ni o'chirish
      await user.save();

      return { message: 'Parol muvaffaqiyatli o\'zgartirildi' };
    } catch (error) {
      throw new BadRequestException('Parolni o\'zgartirishda xatolik yuz berdi: ' + error.message);
    }
  }

  // Chiqish (Logout)
  async logout(logoutDto: LogoutDto): Promise<{ message: string }> {
    try {
      const { token } = logoutDto;
      return { message: 'Muvaffaqiyatli chiqdingiz' };
    } catch (error) {
      throw new BadRequestException('Chiqishda xatolik yuz berdi: ' + error.message);
    }
  }
}