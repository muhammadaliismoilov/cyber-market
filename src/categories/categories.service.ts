import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schema/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Product } from 'src/products/schema/product.schema';

// Kategoriya xizmatlari: CRUD operatsiyalarni, shu jumladan rasmni boshqaradi
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  
  ) {}

  // Barcha kategoriyalarni olish
  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryModel.find().exec();
    } catch (error) {
      throw new BadRequestException('Kategoriyalarni olishda xatolik yuz berdi');
    }
  }

  // Bitta kategoriyani ID bo'yicha olish
  async findOne(id: string): Promise<any> {
    try {
      const category = await this.categoryModel.findById(id).exec();
      if (!category) {
        throw new BadRequestException('Kategoriya topilmadi');
      }
      const products = await this.productModel.findOne({category_id:id}).exec()
      
       
      return {
      category,
      products
      } ;
    } catch (error) {
      throw new BadRequestException('Kategoriyani olishda xatolik yuz berdi');
    }
  }

  // Yangi kategoriya yaratish, rasm fayli bilan
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const { title } = createCategoryDto;
      const existingCategory = await this.categoryModel.findOne({ title }).exec();
      if (existingCategory) {
        throw new BadRequestException('Bunday kategoriya mavjud');
      }

      const categoryData = {
        ...createCategoryDto,
       
      };

      const category = await this.categoryModel.create(categoryData);
      return category;
    } catch (error) {
      throw new BadRequestException('Kategoriya yaratishda xatolik yuz berdi');
    }
  }

  // Kategoriyani yangilash, rasm fayli bilan
  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    try {
      let updateData = { ...updateCategoryDto };

      const category = await this.categoryModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
      if (!category) {
        throw new BadRequestException('Kategoriya topilmadi');
      }
      return category;
    } catch (error) {
      throw new BadRequestException('Kategoriyani yangilashda xatolik yuz berdi');
    }
  }

  // Kategoriyani o'chirish
  async remove(id: string): Promise<Category> {
    try {
      const category = await this.categoryModel.findByIdAndDelete(id).exec();
      if (!category) {
        throw new BadRequestException('Kategoriya topilmadi');
      }
      return category;
    } catch (error) {
      throw new BadRequestException('Kategoriyani o\'chirishda xatolik yuz berdi');
    }
  }
}