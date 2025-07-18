import { Module } from '@nestjs/common';
import { BuyService } from './buy.service';
import { BuyController } from './buy.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Buy, BuySchema } from './schema/buy.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:Buy.name,schema:BuySchema}
    ])
  ],
  controllers: [BuyController],
  providers: [BuyService],
})
export class BuyModule {}
