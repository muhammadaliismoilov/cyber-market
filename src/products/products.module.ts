// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { MulterModule } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { ProductsService } from './products.service';
// import { ProductsController } from './products.controller';
// import { Product, ProductSchema } from './schema/product.schema';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
//     MulterModule.register({
//       storage: diskStorage({
//         destination: './uploads/products',
//         filename: (req, file, cb) => {
//           const randomName = Array(32)
//             .fill(null)
//             .map(() => Math.round(Math.random() * 16).toString(16))
//             .join('');
//           return cb(null, `${randomName}${extname(file.originalname)}`);
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         const allowedTypes = ['image/jpeg', 'image/png'];
//         if (!allowedTypes.includes(file.mimetype)) {
//           return cb(new Error('Faqat JPG va PNG fayllari qo\'shilishi mumkin'), false);
//         }
//         cb(null, true);
//       },
//     }),
//   ],
//   controllers: [ProductsController],
//   providers: [ProductsService],
// })
// export class ProductsModule {}


import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schema/product.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { Category, CategorySchema } from 'src/categories/schema/category.schema';
import { Like, LikeSchema } from 'src/likes/schema/like.schema';

@Module({
  imports: [
    // MongoDB modelni ro‘yxatdan o‘tkazamiz
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Like.name, schema: LikeSchema } 
    ]),

    // Fayllarni vaqtincha saqlash uchun multer sozlamasi
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/tmp';
          fs.mkdirSync(uploadPath, { recursive: true }); // katalog mavjud bo'lmasa yaratish
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(new Error('Faqat JPG, PNG yoki WebP rasm fayllariga ruxsat etiladi'), false);
        }
        cb(null, true);
      },
      limits: {
        files: 6,
        fileSize: 5 * 1024 * 1024, // Maks 5 MB
      },
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
