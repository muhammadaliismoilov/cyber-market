import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBuyDto } from './dto/create-buy.dto';
import { UpdateBuyDto } from './dto/update-buy.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Buy } from './schema/buy.schema';
import { Model } from 'mongoose';
import { BuyModule } from './buy.module';

@Injectable()
export class BuyService {
  constructor(
    @InjectModel(Buy.name) private buyModel: Model<Buy>,
  ){}
  async create(createBuyDto: CreateBuyDto): Promise<Buy> {
    return this.buyModel.create(createBuyDto)
  }

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
