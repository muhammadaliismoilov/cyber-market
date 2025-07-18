import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SlidersModule } from './sliders/sliders.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { LikesModule } from './likes/likes.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BuyModule } from './buy/buy.module';
// Asosiy modul: Barcha modullarni birlashtiradi va MongoDB bilan ulanadi
@Module({
  imports: [
     ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true}),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/defaultdb'),
    AuthModule,
    UsersModule,
    SlidersModule,
    CategoriesModule,
    ProductsModule,
    LikesModule,
    BuyModule,
  ],
})
export class AppModule {}