import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BadRequestException } from '../common/exceptions/bad-request.exception';

// Mahsulot xizmatlari: CRUD operatsiyalarni, shu jumladan rasm fayllarini boshqaradi
@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  // Yangi mahsulot yaratish, rasm fayllari bilan
  async create(createProductDto: CreateProductDto, files: Express.Multer.File[]): Promise<Product> {
    try {
      // Rasm fayllari sonini tekshirish (maksimum 4)
      if (files && files.length > 4) {
        throw new BadRequestException('Maksimum 4 rasm qo\'shish mumkin');
      }

      // Fayllardan URL yoki fayl nomlarini olish uchun logika
      const imgPaths = files ? files.map(file => `/uploads/products/${file.filename}`) : [];

      const productData = {
        ...createProductDto,
        imgs: imgPaths,
      };

      const product = await this.productModel.create(productData);
      return product;
    } catch (error) {
      throw new BadRequestException('Mahsulot yaratishda xatolik yuz berdi');
    }
  }

  // Barcha mahsulotlarni olish
  async findAll(): Promise<Product[]> {
    try {
      return await this.productModel.find().exec();
    } catch (error) {
      throw new BadRequestException('Mahsulotlarni olishda xatolik yuz berdi');
    }
  }

  // Bitta mahsulotni ID bo'yicha olish
  async findOne(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findById(id).exec();
      if (!product) {
        throw new BadRequestException('Mahsulot topilmadi');
      }
      return product;
    } catch (error) {
      throw new BadRequestException('Mahsulotni olishda xatolik yuz berdi');
    }
  }

  // Mahsulotni yangilash, rasm fayllari bilan
  async update(id: string, updateProductDto: UpdateProductDto, files?: Express.Multer.File[]): Promise<Product> {
    try {
      let updateData = { ...updateProductDto };

      // Yangi rasm fayllari bo'lsa, ularni qayta ishlash
      if (files && files.length > 0) {
        if (files.length > 4) {
          throw new BadRequestException('Maksimum 4 rasm qo\'shish mumkin');
        }
        const imgPaths = files.map(file => `/uploads/products/${file.filename}`);
        updateData = { ...updateData, imgs: imgPaths };
      }

      const product = await this.productModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
      if (!product) {
        throw new BadRequestException('Mahsulot topilmadi');
      }
      return product;
    } catch (error) {
      throw new BadRequestException('Mahsulotni yangilashda xatolik yuz berdi');
    }
  }

  // Mahsulotni o'chirish
  async remove(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findByIdAndDelete(id).exec();
      if (!product) {
        throw new BadRequestException('Mahsulot topilmadi');
      }
      return product;
    } catch (error) {
      throw new BadRequestException('Mahsulotni o\'chirishda xatolik yuz berdi');
    }
  }
}