import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

// Like uchun controller: CRUD operatsiyalarini boshqaradi
@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Returns all likes.' })
  @ApiResponse({ status: 400, description: 'Error fetching likes.' })
  getAll() {
    return this.likesService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Returns a single like by ID.' })
  @ApiResponse({ status: 404, description: 'Like not found.' })
  getOne(@Param('id') id: string) {
    return this.likesService.getOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, description: 'Like successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid user or product ID.' })
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likesService.create(createLikeDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Like successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request or like not found.' })
  update(@Param('id') id: string, @Body() updateLikeDto: UpdateLikeDto) {
    return this.likesService.update(id, updateLikeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Like successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Like not found.' })
  delete(@Param('id') id: string) {
    return this.likesService.delete(id);
  }
}