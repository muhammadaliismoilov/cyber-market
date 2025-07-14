import { HttpException, HttpStatus } from '@nestjs/common';

// Maxsus xato klassi: 400 Bad Request xatolarini boshqarish uchun
export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}