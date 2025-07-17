import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { Like, LikeSchema } from './schema/like.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { Product, ProductSchema } from 'src/products/schema/product.schema';

// Like moduli: Mongoose va xizmatlarni birlashtiradi
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Like.name, schema: LikeSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema }
    ]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}