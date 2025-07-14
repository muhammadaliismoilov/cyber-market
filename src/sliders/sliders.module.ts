import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SlidersService } from './sliders.service';
import { SlidersController } from './sliders.controller';
import { Slider, SliderSchema } from './schema/slider.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Slider moduli: Mongoose va Multer sozlamalarini o'z ichiga oladi
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Slider.name, schema: SliderSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/sliders', // Rasm fayllari saqlanadigan jild
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [SlidersController],
  providers: [SlidersService],
})
export class SlidersModule {}