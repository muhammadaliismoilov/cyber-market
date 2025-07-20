import { BadRequestException, Body, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBuyDto } from './dto/create-buy.dto';
import { UpdateBuyDto } from './dto/update-buy.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Buy } from './schema/buy.schema';
import { Model } from 'mongoose';
import { BuyModule } from './buy.module';
import { Product } from 'src/products/schema/product.schema';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class BuyService {
  constructor(
    @InjectModel(Buy.name) private buyModel: Model<Buy>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
  ){}
  async create(@Body()createBuyDto: CreateBuyDto): Promise<Buy> {
    const {user_id, product_id, color, memory, count } = createBuyDto;

    const  user = await this.userModel.findById(user_id)
    if (!user) throw new BadRequestException('Foydalanuvchi topilmadi');
  // 1. Mahsulot mavjudligini tekshirish
  const product = await this.productModel.findById(product_id);
  if (!product) throw new BadRequestException('Mahsulot topilmadi');
  // 2. Color bo‘yicha tekshirish
  if (!product.color.includes(color!)) throw new BadRequestException(`Mahsulot bu rangda mavjud emas: ${color}`);
  // 3. Memory bo‘yicha tekshirish
  if (!product.memory.includes(memory!)) throw new BadRequestException(`Mahsulot bu xotira bilan mavjud emas: ${memory}`);
  // 4. Count yetarli yoki yo‘qligini tekshirish
  if (product.count < count) throw new BadRequestException(`Mahsulotdan faqat ${product.count} dona mavjud`);
  // 5. Mahsulot sonini kamaytirish
  product.count -= count;
  await product.save();
  // 6. Xaridni saqlash
  const newBuy = await this.buyModel.create(createBuyDto);
  return newBuy;
  }

//   async getBestsellers(page: number = 1) {
//   const limit = 5;
//   const skip = (page - 1) * limit;

//   const result = await this.buyModel.aggregate([
//     {
//       $group: {
//         _id: '$product_id',
//         totalSold: { $sum: '$count' }, // nechta sotilganini hisoblaymiz
//       },
//     },
//     {
//       $sort: { totalSold: -1 }, // eng ko‘p sotilgan mahsulotlar yuqorida
//     },
//     {
//       $skip: skip,
//     },
//     {
//       $limit: limit,
//     },
//     {
//       $lookup: {
//         from: 'products', // MongoDB'dagi productlar kolleksiyasi nomi
//         localField: '_id',
//         foreignField: '_id',
//         as: 'product',
//       },
//     },
//     {
//       $unwind: '$product',
//     },
//     {
//       $project: {
//         _id: '$product._id',
//         name: '$product.name',
//         price: '$product.price',
//         totalSold: 1,
//         createdAt: '$product.createdAt',
//       },
//     },
//   ]);

//   const totalProducts = await this.buyModel.distinct('product_id');
//   const total = totalProducts.length;
//   const hasNext = page * limit < total;
//   const hasPrev = page > 1;

//   return {
//     page,
//     total,
//     hasNext,
//     hasPrev,
//     products: result,
//   };
// }


  async findAll(userId: string): Promise<Buy[]> {
    return await this.buyModel.find({ userId });
  }

  async findOne(id: string): Promise<Buy> {
    const buy = await this.buyModel.findById(id);
    if (!buy) throw new NotFoundException("Mahsulot topilamdi");
    return buy;
  }

  async update(
    id: string,
    updateBuyDto: UpdateBuyDto,
  ): Promise<Buy> {
    const updated = await this.buyModel.findByIdAndUpdate(
      id,
      updateBuyDto,
      { new: true },
    );
    if (!updated) throw new NotFoundException("Mahsulot topilmadi");
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const res = await this.buyModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException("Mahsulot topilmadi");
    return { message: "Mahsulot o`chirildi" };
  }
}
