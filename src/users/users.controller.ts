import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards, BadRequestException, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/guard/roles.decarator';

// Foydalanuvchilar uchun controller: CRUD operatsiyalarini boshqaradi
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
   @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles("admin","superadmin")
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish', description: 'Barcha foydalanuvchilar ro‘yxatini qaytaradi.' })
  @ApiResponse({ status: 200, description: 'Barcha foydalanuvchilar muvaffaqiyatli qaytarildi.' })
  @ApiResponse({ status: 400, description: 'Foydalanuvchilarni olishda xatolik yuz berdi.' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi.' })
  getAll() {
    try {
      return this.usersService.getAll();
    } catch (error) {
      throw new BadRequestException('Foydalanuvchilarni olishda xatolik yuz berdi');
    }
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Bitta foydalanuvchini ID bo‘yicha olish', description: 'Berilgan ID bo‘yicha foydalanuvchini qaytaradi.' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi muvaffaqiyatli topildi.' })
  @ApiResponse({ status: 400, description: 'Foydalanuvchi topilmadi yoki xatolik yuz berdi.' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi.' })
  getOne(@Param('id') id: string) {
    try {
      return this.usersService.getOne(id);
    } catch (error) {
      throw new BadRequestException('Foydalanuvchi topilmadi yoki xatolik yuz berdi');
    }
  }



  @Put(':id')
   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Foydalanuvchini yangilash', description: 'Berilgan ID bo‘yicha foydalanuvchi ma’lumotlarini yangilaydi.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Ali Updated' },
        email: { type: 'string', example: 'ali.updated@example.com' },
        phone_number: { type: 'string', example: '+998901234567', nullable: true },
        password: { type: 'string', example: 'newpassword123', nullable: true },
        role: { type: 'string', enum: ['admin', 'user', 'superadmin'], example: 'user', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi muvaffaqiyatli yangilandi.' })
  @ApiResponse({ status: 400, description: 'Foydalanuvchi topilmadi yoki yangilashda xatolik yuz berdi.' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return this.usersService.update(id, updateUserDto);
    } catch (error) {
      throw new BadRequestException('Foydalanuvchi yangilashda xatolik yuz berdi');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Foydalanuvchini o‘chirish', description: 'Berilgan ID bo‘yicha foydalanuvchini o‘chiradi.' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi muvaffaqiyatli o‘chirildi.' })
  @ApiResponse({ status: 400, description: 'Foydalanuvchi topilmadi yoki o‘chirishda xatolik yuz berdi.' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi.' })
  delete(@Param('id') id: string) {
    try {
      return this.usersService.delete(id);
    } catch (error) {
      throw new BadRequestException('Foydalanuvchi o‘chirishda xatolik yuz berdi');
    }
  }
}