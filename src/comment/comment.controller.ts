import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { Comment } from './schema/comment.schema';

@ApiTags("Comment")
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Comment yozish', description: 'Foydalanuvchi mahsulotga comment yozadi' })
  @ApiBody({
    type: CreateCommentDto,
    examples: {
      default: {
        summary: 'Comment yozish misoli',
        value: {
          user_id: '64d2f493e2f2b98b7c99aab3',
          product_id: '64d2f497e2f2b98b7c99aab4',
          comment: 'Yaxshi mahsulot!',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Comment muvaffaqiyatli yaratildi', type: Comment })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi yoki mahsulot topilmadi' })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha commentlar', description: 'Tizimdagi barcha commentlar roʻyxati' })
  @ApiResponse({ status: 200, description: 'Commentlar roʻyxati', type: [Comment] })
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Comment olish', description: 'Berilgan ID bo‘yicha commentni olish' })
  @ApiParam({ name: 'id', description: 'Comment ID', type: String })
  @ApiResponse({ status: 200, description: 'Comment topildi', type: Comment })
  @ApiResponse({ status: 404, description: 'Comment topilmadi' })
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Commentni yangilash', description: 'Berilgan ID bo‘yicha commentni yangilash' })
  @ApiParam({ name: 'id', description: 'Comment ID', type: String })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ status: 200, description: 'Comment yangilandi', type: Comment })
  @ApiResponse({ status: 404, description: 'Comment topilmadi' })
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Commentni o‘chirish', description: 'Berilgan ID bo‘yicha commentni o‘chirish' })
  @ApiParam({ name: 'id', description: 'Comment ID', type: String })
  @ApiResponse({ status: 200, description: 'Comment muvaffaqiyatli o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Comment topilmadi' })
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
