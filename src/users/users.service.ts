import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

// Foydalanuvchi xizmatlari: CRUD operatsiyalarni boshqaradi
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Barcha foydalanuvchilarni olish
  async getAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      throw new BadRequestException('Foydalanuvchilarni olishda xatolik yuz berdi');
    }
  }

  // Bitta foydalanuvchini ID bo'yicha olish
  async getOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new BadRequestException('Foydalanuvchi topilmadi');
      }
      return user;
    } catch (error) {
      throw new BadRequestException('Foydalanuvchini olishda xatolik yuz berdi');
    }
  }

  // Foydalanuvchini yangilash
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
      if (!user) {
        throw new BadRequestException('Foydalanuvchi topilmadi');
      }
      return user;
    } catch (error) {
      throw new BadRequestException('Foydalanuvchini yangilashda xatolik yuz berdi');
    }
  }

  // Foydalanuvchini o'chirish
  async delete(id: string): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndDelete(id).exec();
      if (!user) {
        throw new BadRequestException('Foydalanuvchi topilmadi');
      }
      return user;
    } catch (error) {
      throw new BadRequestException('Foydalanuvchini o\'chirishda xatolik yuz berdi');
    }
  }
}