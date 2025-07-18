import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schema/comment.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { Product, ProductSchema } from 'src/products/schema/product.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
          { name: Comment.name, schema: CommentSchema },
          { name: User.name, schema: UserSchema },
          { name: Product.name, schema: ProductSchema }
        ])
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
