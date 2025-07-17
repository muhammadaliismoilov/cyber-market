// likes.controller.ts
import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get()
  
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Barcha like larni olish',
    description: 'Tizimdagi barcha like yozuvlarini qaytaradi.',
  })
  @ApiResponse({ status: 200, description: 'Barcha like lar qaytarildi.' })
  @ApiResponse({ status: 500, description: 'Like larni olishda xatolik yuz berdi.' })
  getAll() {
    return this.likesService.getAll();
  }

  @Get(':id')
  
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Like ni ID bo‘yicha olish',
    description: 'Berilgan ID bo‘yicha like yozuvini qaytaradi.',
  })
  @ApiParam({ name: 'id', description: 'Like ID' })
  @ApiResponse({ status: 200, description: 'Like muvaffaqiyatli topildi.' })
  @ApiResponse({ status: 404, description: 'Like topilmadi.' })
  getOne(@Param('id') id: string) {
    return this.likesService.getOne(id);
  }

  @Post()
  
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Yangi like yaratish',
    description: 'Foydalanuvchi va mahsulotga like qo‘shadi.',
  })
  @ApiBody({
    type: CreateLikeDto,
    description: 'Like yaratish uchun ma’lumotlar',
    examples: {
      misol: {
        summary: 'Oddiy like yaratish',
        value: {
          user_id: '64e10f7f4b2fdc001d8b8abc',
          product_id: '64e10f9c4b2fdc001d8b8ac1',
          isLiked: true,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Like muvaffaqiyatli yaratildi.' })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi yoki mahsulot topilmadi.' })
  @ApiResponse({ status: 500, description: 'Like yaratishda ichki xatolik yuz berdi.' })
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likesService.create(createLikeDto);
  }

  @Patch(':id')
  
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Like ni yangilash',
    description: 'Berilgan ID bo‘yicha like yozuvini yangilaydi.',
  })
  @ApiParam({ name: 'id', description: 'Yangilanayotgan like IDsi' })
  @ApiBody({
    type: UpdateLikeDto,
    description: 'Yangilash uchun yangi maʼlumotlar',
    examples: {
      misol: {
        summary: 'isLiked ni yangilash',
        value: { isLiked: false },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Like muvaffaqiyatli yangilandi.' })
  @ApiResponse({ status: 404, description: 'Like topilmadi.' })
  @ApiResponse({ status: 500, description: 'Yangilashda ichki xatolik yuz berdi.' })
  update(@Param('id') id: string, @Body() updateLikeDto: UpdateLikeDto) {
    return this.likesService.update(id, updateLikeDto);
  }

  @Delete(':id')
  
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Like ni o‘chirish',
    description: 'Berilgan ID bo‘yicha like yozuvini o‘chiradi.',
  })
  @ApiParam({ name: 'id', description: 'O‘chirilayotgan like IDsi' })
  @ApiResponse({ status: 200, description: 'Like muvaffaqiyatli o‘chirildi.' })
  @ApiResponse({ status: 404, description: 'Like topilmadi.' })
  @ApiResponse({ status: 500, description: 'O‘chirishda ichki xatolik yuz berdi.' })
  delete(@Param('id') id: string) {
    return this.likesService.delete(id);
  }
}
