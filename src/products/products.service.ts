import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model,Types } from "mongoose";
import { Product } from "./schema/product.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UploadClient } from "@uploadcare/upload-client";
import * as fs from "fs";
import { Category } from "src/categories/schema/category.schema";
import { Like } from "src/likes/schema/like.schema";
import { Comment } from "src/comment/schema/comment.schema";
import { Buy } from "src/buy/schema/buy.schema";

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
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Buy.name) private buyModel: Model<Buy>
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

async search(query: any): Promise<object> {
    const plainQuery = { ...query };
    const filters: any = {};

    if (plainQuery.title) {
      filters.title = { $regex: plainQuery.title, $options: 'i' };
    }

    if (plainQuery.minPrice || plainQuery.maxPrice) {
      filters.price = {};
      if (plainQuery.minPrice) filters.price.$gte = Number(plainQuery.minPrice);
      if (plainQuery.maxPrice) filters.price.$lte = Number(plainQuery.maxPrice);
    }

    if (plainQuery.count) {
      filters.count = Number(plainQuery.count);
    }

    if (plainQuery.color) {
      const colors = plainQuery.color.split(',');
      filters.color = { $in: colors.map((c: string) => new RegExp(c, 'i')) };
    }

    if (plainQuery.memory) {
      const memories = plainQuery.memory.split(',');
      filters.memory = { $in: memories.map((m: string) => new RegExp(m, 'i')) };
    }

    const [products, count] = await Promise.all([
      this.productModel.find(filters).exec(),
      this.productModel.countDocuments(filters).exec(),
    ]);

    return { count, products };
  }


async NewArrivle(page: number = 1) {
  const limit = 5;
  const skip = (page - 1) * limit;

  const total = await this.productModel.countDocuments();

  const products = await this.productModel
    .find()
    .sort({ createdAt: -1 }) // YANGI qo‘shilgan mahsulotlar birinchi chiqadi
    .skip(skip)
    .limit(limit)
    .exec();

  const hasNext = total > page * limit;
  const hasPrev = page > 1;

  return {
    page,
    total,
    hasNext,
    hasPrev,
    products,
  };
}
  async BestSellears(page: number = 1) {
  const limit = 5;
  const skip = (page - 1) * limit;

  try {
    // Aggregation orqali eng ko‘p sotilgan mahsulotlar ro‘yxati
    const result = await this.buyModel.aggregate([
  {
    $group: {
      _id: '$product_id',
      totalSold: { $sum: '$count' },
    },
  },
  {
    $addFields: {
      productObjectId: {
        $cond: [
          { $eq: [{ $type: '$_id' }, 'string'] },
          { $toObjectId: '$_id' },
          '$_id',
        ],
      },
    },
  },
  {
    $sort: { totalSold: -1 },
  },
  { $skip: skip },
  { $limit: limit },
  {
    $lookup: {
      from: 'products',
      localField: 'productObjectId',
      foreignField: '_id',
      as: 'product',
    },
  },
  { $unwind: '$product' },
  {
    $project: {
      _id: '$product._id',
      name: '$product.name',
      price: '$product.price',
      imgs: '$product.imgs',
      totalSold: 1,
      createdAt: '$product.createdAt',
    },
  },
]);

    // Umumiy mahsulotlar soni (distinct product_id boyicha)
    const totalProducts = await this.buyModel.distinct('product_id');
    const total = totalProducts.length;
    const hasNext = page * limit < total;
    const hasPrev = page > 1;

    return {
      page,
      total,
      hasNext,
      hasPrev,
      products: result,
    };
  } catch (error) {
    throw new InternalServerErrorException('Eng ko`p sotilgan mahsulotlarni olishda xatolik yuz berdi');
  }
}




  async findAll(): Promise<Product[]> {
    try {
      return await this.productModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException("Mahsulotlarni olishda server xatoligi yuz berdi");
    }
  }

  async findOne(id: string): Promise<{ product: Product; comments: Comment[]}> {
    try {
      const product = await this.productModel.findById(id).exec();
      if (!product) {
        throw new NotFoundException("Mahsulot topilmadi");
      }
      const comments = await this.commentModel.find().exec();

    return {
      product,
      comments,
    };
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
