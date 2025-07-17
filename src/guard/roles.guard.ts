    import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decarator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Controllerdagi kerakli rolarni olamiz
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Agar hech qanday rol kerak bo'lmasa, ruxsat beramiz
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Agar foydalanuvchi yo'q bo‘lsa yoki roli yo‘q bo‘lsa
    if (!user || !user.role) {
      throw new ForbiddenException('Sizda ruxsat yo‘q');
    }

    // Foydalanuvchining roli kerakli ro'lardan biri bo‘lishi kerak
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Siz bu amalni bajarish uchun ruxsatga ega emassiz');
    }

    return true;
  }
}
