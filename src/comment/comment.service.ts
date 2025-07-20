// comment.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './schema/comment.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/products/schema/product.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    try {
      const { user_id, product_id } = createCommentDto;
      const user = await this.userModel.findById(user_id);
      if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");

      const product = await this.productModel.findById(product_id);
      if (!product) throw new NotFoundException("Mahsulot topilmadi");

      const comment = await this.commentModel.create(createCommentDto);
      return comment;
    } catch (error) {
      throw new InternalServerErrorException("Comment yozishda xatolik yuz berdi");
    }
  }

  async findAll(): Promise<Comment[]> {
    try {
      return await this.commentModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException("Barcha commentlarni olishda xatolik yuz berdi");
    }
  }

  async findOne(id: string): Promise<Comment> {
    try {
      const comment = await this.commentModel.findById(id).exec();
      if (!comment) {
        throw new NotFoundException("Comment topilmadi");
      }
      return comment;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException("Commentni olishda xatolik yuz berdi");
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    try {
      const updatedComment = await this.commentModel.findByIdAndUpdate(id, updateCommentDto, {
        new: true,
      }).exec();

      if (!updatedComment) throw new NotFoundException("Comment topilmadi");

      return updatedComment;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException("Comment yangilashda xatolik yuz berdi");
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const result = await this.commentModel.findByIdAndDelete(id).exec();
      if (!result) throw new NotFoundException("Comment topilmadi");

      return { message: "Comment muvaffaqiyatli o'chirildi" };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException("Commentni o'chirishda xatolik yuz berdi");
    }
  }
}
