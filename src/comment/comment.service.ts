import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './schema/comment.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/products/schema/product.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private categoryModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ){}
  async create(createCommentDto: CreateCommentDto) {


    return 'This action adds a new comment';
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
