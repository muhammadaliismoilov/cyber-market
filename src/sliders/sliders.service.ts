import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slider } from './schema/slider.schema';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { BadRequestException } from '../common/exceptions/bad-request.exception';

// Slider xizmatlari: CRUD operatsiyalarni boshqaradi
@Injectable()
export class SlidersService {
  constructor(@InjectModel(Slider.name) private sliderModel: Model<Slider>) {}

  // Yangi slider yaratish
  async create(createSliderDto: CreateSliderDto, image: Express.Multer.File): Promise<Slider> {
    try {
      // Agar rasm yuklangan bo'lsa, uning yo'lini DTO ga qo'shamiz
      const sliderData = {
        ...createSliderDto,
        image: image ? `/uploads/sliders/${image.filename}` : '',
      };

      const slider = await this.sliderModel.create(sliderData);
      return slider;
    } catch (error) {
      throw new BadRequestException('Slider yaratishda xatolik yuz berdi');
    }
  }

  // Barcha slidlarni olish
  async findAll(): Promise<Slider[]> {
    try {
      return await this.sliderModel.find().exec();
    } catch (error) {
      throw new BadRequestException('Sliderlarni olishda xatolik yuz berdi');
    }
  }

  // Bitta slidni ID bo'yicha olish
  async findOne(id: string): Promise<Slider> {
    try {
      const slider = await this.sliderModel.findById(id).exec();
      if (!slider) {
        throw new BadRequestException('Slider topilmadi');
      }
      return slider;
    } catch (error) {
      throw new BadRequestException('Sliderni olishda xatolik yuz berdi');
    }
  }

  // Slidni yangilash
  async update(id: string, updateSliderDto: UpdateSliderDto, image?: Express.Multer.File): Promise<Slider> {
    try {
      const updateData = { ...updateSliderDto };
      // Agar yangi rasm yuklangan bo'lsa, uning yo'lini yangilaymiz
      if (image) {
        updateData.image = `/uploads/sliders/${image.filename}`;
      }

      const slider = await this.sliderModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
      if (!slider) {
        throw new BadRequestException('Slider topilmadi');
      }
      return slider;
    } catch (error) {
      throw new BadRequestException('Sliderni yangilashda xatolik yuz berdi');
    }
  }

  // Slidni o'chirish
  async remove(id: string): Promise<Slider> {
    try {
      const slider = await this.sliderModel.findByIdAndDelete(id).exec();
      if (!slider) {
        throw new BadRequestException('Slider topilmadi');
      }
      return slider;
    } catch (error) {
      throw new BadRequestException('Sliderni o\'chirishda xatolik yuz berdi');
    }
  }
}