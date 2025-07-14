import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('sliders')
@Controller('sliders')
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
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
  @ApiResponse({ status: 201, description: 'Slider successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request, check input data.' })
  create(@Body() createSliderDto: CreateSliderDto, @UploadedFile() image: Express.Multer.File) {
    return this.slidersService.create(createSliderDto, image);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Returns all sliders.' })
  @ApiResponse({ status: 400, description: 'Error fetching sliders.' })
  findAll() {
    return this.slidersService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Returns a single slider by ID.' })
  @ApiResponse({ status: 404, description: 'Slider not found.' })
  findOne(@Param('id') id: string) {
    return this.slidersService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
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
  @ApiResponse({ status: 200, description: 'Slider successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request or slider not found.' })
  update(@Param('id') id: string, @Body() updateSliderDto: UpdateSliderDto, @UploadedFile() image: Express.Multer.File) {
    return this.slidersService.update(id, updateSliderDto, image);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Slider successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Slider not found.' })
  remove(@Param('id') id: string) {
    return this.slidersService.remove(id);
  }
}