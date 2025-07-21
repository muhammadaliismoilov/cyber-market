import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { BuyService } from './buy.service';
import { CreateBuyDto } from './dto/create-buy.dto';
import { UpdateBuyDto } from './dto/update-buy.dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Buy')
@Controller('buy')
export class BuyController {
  constructor(private readonly buyService: BuyService) {}

  @Post("create_buy")
  @ApiOperation({ summary: 'Yangi sotib olishni yaratish' })
  @ApiResponse({ status: 201, description: 'Mahsulot muvaffaqiyatli qo‘shildi.' })
  @ApiResponse({ status: 404, description: 'Mahsulot mavjud emas' })
  @ApiResponse({ status: 500, description: 'Serverda kutilmagan xatolik yuz berdi' })
  create(@Body() createBuyDto: CreateBuyDto) {
    return this.buyService.create(createBuyDto);
  }

  @Get('get_all_buy/:userId')
  @ApiOperation({ summary: 'Foydalanuvchiga tegishli barcha sotib olishlarni olish' })
  @ApiParam({ name: 'userId', description: 'Foydalanuvchi IDsi' })
  @ApiResponse({ status: 200, description: 'Barcha sotib olingan mahsulotlar ro‘yxati' })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi yoki xaridlar  topilmadi' })
  @ApiResponse({ status: 500, description: 'Serverda kutilmagan xatolik yuz berdi' })
  findAll(@Param('userId') userId: string) {
    return this.buyService.findAll(userId);
  }

  @Get('find_one_buy/:id')
  @ApiOperation({ summary: 'Bitta sotib olishni topish' })
  @ApiParam({ name: 'id', description: 'Sotib olingan mahsulot IDsi' })
  @ApiResponse({ status: 200, description: 'Topilgan mahsulot' })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
  @ApiResponse({ status: 500, description: 'Serverda kutilmagan xatolik yuz berdi' })
  findOne(@Param('id') id: string) {
    return this.buyService.findOne(id);
  }

  @Put('update_buy/:id')
  @ApiOperation({ summary: 'Sotib olishni yangilash' })
  @ApiParam({ name: 'id', description: 'Sotib olingan mahsulot IDsi' })
  @ApiResponse({ status: 200, description: 'Mahsulot muvaffaqiyatli yangilandi' })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
  @ApiResponse({ status: 500, description: 'Serverda kutilmagan xatolik yuz berdi' })
  update(@Param('id') id: string, @Body() updateBuyDto: UpdateBuyDto) {
    return this.buyService.update(id, updateBuyDto);
  }

  @Delete('delete_buy/:id')
  @ApiOperation({ summary: 'Sotib olingan mahsulotni o‘chirish' })
  @ApiParam({ name: 'id', description: 'Sotib olingan mahsulot IDsi' })
  @ApiResponse({ status: 200, description: 'Mahsulot o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
  @ApiResponse({ status: 500, description: 'Serverda kutilmagan xatolik yuz berdi' })
  remove(@Param('id') id: string) {
    return this.buyService.remove(id);
  }
}
