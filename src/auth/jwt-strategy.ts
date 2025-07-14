import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// JWT strategiyasi: Tokenni tekshirish va foydalanuvchi ma'lumotlarini qaytarish
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret, // .env dan maxfiy kalitni olish
    });
  }

  async validate(payload: any) {
    try {
      // Token ichidagi foydalanuvchi ma'lumotlarini tekshirish
      if (!payload.sub || !payload.email) {
        throw new BadRequestException('Token noto\'g\'ri formatda');
      }
      return { userId: payload.sub, email: payload.email, name: payload.name, role: payload.role };
    } catch (error) {
      throw new BadRequestException('JWT tasdiqlashda xatolik yuz berdi');
    }
  }
}