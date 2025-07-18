import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product } from "./schema/product.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UploadClient } from "@uploadcare/upload-client";
import * as fs from "fs";
import { Category } from "src/categories/schema/category.schema";
import { Like } from "src/likes/schema/like.schema";

@Injectable()
export class ProductsService {
  private client = new UploadClient({
    publicKey:
      process.env.UPLOADCARE_PUBLIC_KEY ?? (() => {
        throw new Error("UPLOADCARE_PUBLIC_KEY is not defined");
      })(),
  });

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
    // @InjectModel(Category.name) private categoryModel: Model<Category>
  ) {}

  async create(createProductDto: CreateProductDto, files: Express.Multer.File[]): Promise<Product> {
    try {
      const category = await this.categoryModel.findById(createProductDto.category_id);
      if (!category) throw new NotFoundException("Kategoriya topilmadi");

      if (files && files.length > 6) {
        throw new BadRequestException("Maksimum 6 ta rasm yuklash mumkin");
      }

      const imageUrls: string[] = [];

      for (const file of files || []) {
        const buffer = fs.readFileSync(file.path);
        const result: any = await this.client.uploadFile(buffer, {
          fileName: file.originalname,
        });
        fs.unlinkSync(file.path);
        imageUrls.push(result.cdnUrl);
      }

      if (imageUrls.length === 0) {
        throw new BadRequestException("Kamida 1 ta rasm yuklanishi kerak");
      }

      const productData = {
        ...createProductDto,
        imgs: imageUrls,
      };

      return await this.productModel.create(productData);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Mahsulot yaratishda server xatoligi yuz berdi");
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return await this.productModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException("Mahsulotlarni olishda server xatoligi yuz berdi");
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findById(id).exec();
      if (!product) {
        throw new NotFoundException("Mahsulot topilmadi");
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Mahsulotni olishda server xatoligi yuz berdi");
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, files?: Express.Multer.File[]): Promise<Product> {
    try {
      const updateData = { ...updateProductDto };

      if (files && files.length > 0) {
        if (files.length > 6) {
          throw new BadRequestException("Maksimum 6 ta rasm yuklash mumkin");
        }

        const imageUrls: string[] = [];

        for (const file of files || []) {
          const buffer = fs.readFileSync(file.path);
          const result: any = await this.client.uploadFile(buffer, {
            fileName: file.originalname,
          });
          fs.unlinkSync(file.path);
          imageUrls.push(result.cdnUrl);
        }

        updateData["imgs"] = imageUrls;
      }

      const product = await this.productModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
      if (!product) {
        throw new NotFoundException("Mahsulot topilmadi");
      }
      return product;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Mahsulotni yangilashda server xatoligi yuz berdi");
    }
  }

  async remove(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findByIdAndDelete(id).exec();
      if (!product) {
        throw new NotFoundException("Mahsulot topilmadi");
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Mahsulotni o'chirishda server xatoligi yuz berdi");
    }
  }
}
