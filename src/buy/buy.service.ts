import {
  BadRequestException,
  Body,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateBuyDto } from "./dto/create-buy.dto";
import { UpdateBuyDto } from "./dto/update-buy.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Buy } from "./schema/buy.schema";
import { Model } from "mongoose";
import { BuyModule } from "./buy.module";
import { Product } from "src/products/schema/product.schema";
import { User } from "src/users/schema/user.schema";

@Injectable()
export class BuyService {
  constructor(
    @InjectModel(Buy.name) private buyModel: Model<Buy>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}
  async create(@Body() createBuyDto: CreateBuyDto): Promise<Buy> {
    try {
      const { user_id, product_id, color, memory, count } = createBuyDto;

      const user = await this.userModel.findById(user_id);
      if (!user) throw new BadRequestException("Foydalanuvchi topilmadi");
      // 1. Mahsulot mavjudligini tekshirish
      const product = await this.productModel.findById(product_id);
      if (!product) throw new BadRequestException("Mahsulot topilmadi");
      // 2. Color bo‘yicha tekshirish
      if (!product.color.includes(color!))
        throw new BadRequestException(
          `Mahsulot bu rangda mavjud emas: ${color}`
        );
      // 3. Memory bo‘yicha tekshirish
      if (!product.memory.includes(memory!))
        throw new BadRequestException(
          `Mahsulot bu xotira bilan mavjud emas: ${memory}`
        );
      // 4. Count yetarli yoki yo‘qligini tekshirish
      if (product.count < count)
        throw new BadRequestException(
          `Mahsulotdan faqat ${product.count} dona mavjud`
        );
      // 5. Mahsulot sonini kamaytirish
      product.count -= count;
      await product.save();
      // 6. Xaridni saqlash
      const newBuy = await this.buyModel.create(createBuyDto);
      return newBuy;
    } catch (error) {
      throw new InternalServerErrorException({
        "Xarid qilishda xatolik": error.message,
      });
    }
  }

  async findAll(userId: string): Promise<Buy[]> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");

      const buys = await this.buyModel.find({ user_id: userId });
      if (!buys || buys.length === 0)
        throw new NotFoundException("Xaridlar topilmadi");

      return buys;
    } catch (error) {
      throw new InternalServerErrorException({
        "Xaridlarni olishda xatolik": error.message,
      });
    }
  }

  async findOne(id: string): Promise<Buy> {
    try {
      const buy = await this.buyModel.findById(id);
    if (!buy) throw new NotFoundException("Mahsulot topilamdi");
    return buy;
    } catch (error) {
      throw new InternalServerErrorException({
        "Xaridlarni olishda xatolik": error.message,
      });
    }
  }

  async update(id: string, updateBuyDto: UpdateBuyDto): Promise<Buy> {
    try {
      const updated = await this.buyModel.findByIdAndUpdate(id, updateBuyDto, {
      new: true,
    });
    if (!updated) throw new NotFoundException("Mahsulot topilmadi");
    return updated;
    } catch (error) {
      throw new InternalServerErrorException({
        "Xaridlarni olishda xatolik": error.message,
      });
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const res = await this.buyModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException("Mahsulot topilmadi");
    return { message: "Mahsulot o`chirildi" };
    } catch (error) {
      throw new InternalServerErrorException({
        "Xaridlarni olishda xatolik": error.message,
      });
    }
  }
}
