import { SetMetadata } from '@nestjs/common';


export const ROLES_KEY = 'roles';

// @Roles('admin') yoki @Roles('user', 'superadmin') deb ishlatish uchun
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
