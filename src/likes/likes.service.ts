import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from './schema/like.schema';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';

// Like xizmatlari: CRUD operatsiyalarni boshqaradi
@Injectable()
export class LikesService {
  constructor(@InjectModel(Like.name) private likeModel: Model<Like>) {}

  // Barcha like'larni olish
  async getAll(): Promise<Like[]> {
    try {
      return await this.likeModel.find().exec();
    } catch (error) {
      throw new BadRequestException('Likelarni olishda xatolik yuz berdi');
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
      const like = await this.likeModel.create(createLikeDto);
      return like;
    } catch (error) {
      throw new BadRequestException('Like yaratishda xatolik yuz berdi');
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
      throw new BadRequestException('Like ni yangilashda xatolik yuz berdi');
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
      throw new BadRequestException('Like ochirishda xatolik yuz berdi');
    }
  }
}