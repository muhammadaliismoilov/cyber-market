import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from './schema/like.schema';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { Product } from 'src/products/schema/product.schema';
import { User } from 'src/users/schema/user.schema';

// Like xizmatlari: CRUD operatsiyalarni boshqaradi
@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Product.name) private productModel: Model<Like>,
    @InjectModel(User.name) private userModel: Model<Like>,
  ) {}

  // Barcha like'larni olish
  async getAll(): Promise<Like[]> {
    try {
      return await this.likeModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Likelarni olishda xatolik yuz berdi');
    }
  }

  // Bitta like'ni ID bo'yicha olish
  async getOne(id: string): Promise<Like> {
    try {
      const like = await this.likeModel.findById(id).exec();
      if (!like) {
        throw new BadRequestException('Like topilmadi');
      }
      return like;
    } catch (error) {
      throw new BadRequestException('Like ni olishda xatolik yuz berdi');
    }
  }

  // Yangi like yaratish
  async create(createLikeDto: CreateLikeDto): Promise<Like> {
    try {
      const user = await this.userModel.findById(createLikeDto.user_id).exec()
      if(!user) throw new NotFoundException("Foydalanuvchi topilmadi")

        const product = await this.productModel.findById(createLikeDto.product_id).exec()
      if(!product) throw new NotFoundException("Mahsulot topilmadi")


      const like = await this.likeModel.create(createLikeDto);
      return like;
    } catch (error) {
      throw new InternalServerErrorException('Like yaratishda xatolik yuz berdi');
    }
  }

  // Like'ni yangilash
  async update(id: string, updateLikeDto: UpdateLikeDto): Promise<Like> {
    try {
      const like = await this.likeModel.findByIdAndUpdate(id, updateLikeDto, { new: true }).exec();
      if (!like) {
        throw new BadRequestException('Like topilmadi');
      }
      return like;
    } catch (error) {
     throw new InternalServerErrorException('Like yaratishda xatolik yuz berdi');
    }
  }

  // Like'ni o'chirish
  async delete(id: string): Promise<Like> {
    try {
      const like = await this.likeModel.findByIdAndDelete(id).exec();
      if (!like) {
        throw new BadRequestException('Like topilmadi');
      }
      return like;
    } catch (error) {
      throw new InternalServerErrorException('Like yaratishda xatolik yuz berdi');
    }
  }
}