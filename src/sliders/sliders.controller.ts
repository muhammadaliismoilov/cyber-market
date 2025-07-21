import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UploadedFile, UseInterceptors, UseGuards,
  Put
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


@ApiTags('Sliders')
@Controller('sliders')
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) {}

  @Post("create_slider")
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles("admin","superadmin")
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
  @ApiResponse({ status: 500, description: 'Serverda kutilmagan xatolik yuz berdi' })
  create(@Body() createSliderDto: CreateSliderDto, @UploadedFile() image: Express.Multer.File) {
    return this.slidersService.create(createSliderDto, image);
  }

  @Get("get_all_sliders")
  @ApiOperation({
    summary: 'Barcha slayderlarni olish',
    description: 'Tizimdagi barcha mavjud slayderlarni ro‘yxat tarzida qaytaradi.'
  })
  @ApiResponse({ status: 200, description: 'Barcha slayderlar ro‘yxati.' })
  @ApiResponse({ status: 404, description: 'Slayderlarni olishda xatolik yuz berdi.' })
  @ApiResponse({ status: 500, description: 'Serverda kutilmagan xatolik yuz berdi' })
  findAll() {
    return this.slidersService.findAll();
  }

  @Get('get_one_slider/:id')
  @ApiOperation({
    summary: 'Bitta slayderni olish',
    description: 'ID bo‘yicha bitta slayderni topib, qaytaradi.'
  })
  @ApiResponse({ status: 200, description: "ID bo'yicha slayder ma'lumotlari." })
  @ApiResponse({ status: 404, description: 'Slayder topilmadi.' })
  @ApiParam({ name: 'id', description: 'Slayder ID raqami' })
  @ApiResponse({ status: 500, description: 'Serverda kutilmagan xatolik yuz berdi' })
  findOne(@Param('id') id: string) {
    return this.slidersService.findOne(id);
  }

  @Put('update_slider:id')
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
  @ApiResponse({ status: 404, description: 'Xatolik yoki slayder topilmadi.' })
  @ApiResponse({ status: 500, description: 'Serverda kutilmagan xatolik yuz berdi' })
  update(@Param('id') id: string, @Body() updateSliderDto: UpdateSliderDto, @UploadedFile() image: Express.Multer.File) {
    return this.slidersService.update(id, updateSliderDto, image);
  }

  @Delete('delete_slider/:id')
   @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles("admin","superadmin")
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Slayderni o‘chirish',
    description: 'ID bo‘yicha slayderni tizimdan o‘chiradi.'
  })
  @ApiResponse({ status: 200, description: 'Slayder o‘chirildi.' })
  @ApiResponse({ status: 404, description: 'Slayder topilmadi.' })
  @ApiResponse({ status: 500, description: 'Serverda kutilmagan xatolik yuz berdi' })
  @ApiParam({ name: 'id', description: 'Slayder ID raqami' })
  remove(@Param('id') id: string) {
    return this.slidersService.remove(id);
  }
}
