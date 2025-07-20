import { Module } from '@nestjs/common';
import { BuyService } from './buy.service';
import { BuyController } from './buy.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Buy, BuySchema } from './schema/buy.schema';
import { Product, ProductSchema } from 'src/products/schema/product.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:Buy.name,schema:BuySchema},
      {name:Product.name,schema:ProductSchema},
      {name:User.name,schema:UserSchema}
    ])
  ],
  controllers: [BuyController,],
  providers: [BuyService],
})
export class BuyModule {}
