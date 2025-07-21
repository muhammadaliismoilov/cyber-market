
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slider } from './schema/slider.schema';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { UploadClient } from '@uploadcare/upload-client';
import * as fs from 'fs';

@Injectable()
export class SlidersService {
  private client = new UploadClient({ 
    publicKey: process.env.UPLOADCARE_PUBLIC_KEY ?? (() => { throw new Error('UPLOADCARE_PUBLIC_KEY is not defined'); })()
  });

  constructor(@InjectModel(Slider.name) private sliderModel: Model<Slider>) {}

  async create(createSliderDto: CreateSliderDto, image: Express.Multer.File): Promise<Slider> {
    try {
      let imageUrl = '';
      if (image) {
        const fileBuffer = fs.readFileSync(image.path);
        const result = await this.client.uploadFile(fileBuffer, {
          fileName: image.originalname,
        });
        fs.unlinkSync(image.path);
        imageUrl = result.cdnUrl;
      }
      const sliderData = { ...createSliderDto, image: imageUrl };
      return await this.sliderModel.create(sliderData);
    } catch (error) {
      throw new InternalServerErrorException('Slider yaratishda xatolik yuz berdi');
    }
  }

  async findAll(): Promise<Slider[]> {
    try {
      return await this.sliderModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Sliderlarni olishda xatolik yuz berdi');
    }
  }

  async findOne(id: string): Promise<Slider> {
    try {
      const slider = await this.sliderModel.findById(id).exec();
      if (!slider) throw new NotFoundException('Slider topilmadi');
      return slider;
    } catch (error) {
      throw new InternalServerErrorException('Sliderni olishda xatolik yuz berdi');
    }
  }

  async update(id: string, updateSliderDto: UpdateSliderDto, image?: Express.Multer.File): Promise<Slider> {
    try {
      let imageUrl;
      if (image) {
        const fileBuffer = fs.readFileSync(image.path);
        const result = await this.client.uploadFile(fileBuffer, {
          fileName: image.originalname,
        });
        fs.unlinkSync(image.path);
        imageUrl = result.cdnUrl;
      }
      const updateData = { ...updateSliderDto };
      if (imageUrl) updateData.image = imageUrl;

      const slider = await this.sliderModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
      if (!slider) throw new NotFoundException('Slider topilmadi');
      return slider;
    } catch (error) {
      throw new InternalServerErrorException('Sliderni yangilashda xatolik yuz berdi');
    }
  }

  async remove(id: string): Promise<Slider> {
    try {
      const slider = await this.sliderModel.findByIdAndDelete(id).exec();
      if (!slider) throw new NotFoundException('Slider topilmadi');
      return slider;
    } catch (error) {
      throw new InternalServerErrorException("Sliderni o'chirishda xatolik yuz berdi");
    }
  }
}