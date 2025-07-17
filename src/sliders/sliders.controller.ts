import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UploadedFile, UseInterceptors, UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SlidersService } from './sliders.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import {
  ApiTags, ApiBearerAuth, ApiConsumes, ApiBody,
  ApiResponse, ApiParam, ApiOperation
} from '@nestjs/swagger';
import { RolesGuard } from 'src/guard/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/guard/roles.decarator';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Sliders')
@Controller('sliders')
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) {}

  @Post()
   @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles("admin","superadmin")
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Yangi slayder qo‘shish',
    description: 'Yangi slayder yaratadi. Rasm bilan birga ma’lumotlar yuboriladi (multipart/form-data).'
  })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Slayder muvaffaqiyatli yaratildi.' })
  @ApiResponse({ status: 400, description: "Xatolik: noto'g'ri ma'lumot yuborildi." })
  create(@Body() createSliderDto: CreateSliderDto, @UploadedFile() image: Express.Multer.File) {
    return this.slidersService.create(createSliderDto, image);
  }

  @Get()
  @ApiOperation({
    summary: 'Barcha slayderlarni olish',
    description: 'Tizimdagi barcha mavjud slayderlarni ro‘yxat tarzida qaytaradi.'
  })
  @ApiResponse({ status: 200, description: 'Barcha slayderlar ro‘yxati.' })
  @ApiResponse({ status: 400, description: 'Slayderlarni olishda xatolik yuz berdi.' })
  findAll() {
    return this.slidersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Bitta slayderni olish',
    description: 'ID bo‘yicha bitta slayderni topib, qaytaradi.'
  })
  @ApiResponse({ status: 200, description: "ID bo'yicha slayder ma'lumotlari." })
  @ApiResponse({ status: 404, description: 'Slayder topilmadi.' })
  @ApiParam({ name: 'id', description: 'Slayder ID raqami' })
  findOne(@Param('id') id: string) {
    return this.slidersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles("admin","superadmin")
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Slayderni yangilash',
    description: 'ID bo‘yicha slayderni yangilaydi. Rasm va boshqa maydonlar o‘zgartiriladi.'
  })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Slayder muvaffaqiyatli yangilandi.' })
  @ApiResponse({ status: 400, description: 'Xatolik yoki slayder topilmadi.' })
  update(@Param('id') id: string, @Body() updateSliderDto: UpdateSliderDto, @UploadedFile() image: Express.Multer.File) {
    return this.slidersService.update(id, updateSliderDto, image);
  }

  @Delete(':id')
   @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles("admin","superadmin")
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Slayderni o‘chirish',
    description: 'ID bo‘yicha slayderni tizimdan o‘chiradi.'
  })
  @ApiResponse({ status: 200, description: 'Slayder o‘chirildi.' })
  @ApiResponse({ status: 404, description: 'Slayder topilmadi.' })
  @ApiParam({ name: 'id', description: 'Slayder ID raqami' })
  remove(@Param('id') id: string) {
    return this.slidersService.remove(id);
  }
}
