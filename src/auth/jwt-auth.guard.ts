import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// JWT autentifikatsiyasi uchun guard: Passport strategiyasini ishga tushiradi
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}