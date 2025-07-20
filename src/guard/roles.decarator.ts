import { SetMetadata } from '@nestjs/common';


export const ROLES_KEY = 'role';

// @Roles('admin') yoki @Roles('user', 'superadmin') deb ishlatish uchun
export const Roles = (...role: string[]) => SetMetadata(ROLES_KEY, role);
