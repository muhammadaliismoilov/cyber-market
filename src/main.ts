import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigModule } from '@nestjs/config';

// Serverni ishga tushirish va global sozlamalar
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   await ConfigModule.forRoot({
    envFilePath: '.env', // .env faylning yo'li
    isGlobal: true, // Global darajada ishlatish
  });
  const PORT = process.env.PORT||3000
  // Global validatsiya quvuri: DTO validatsiyasi uchun, xatolarni o'zbek tilida chiqaradi
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map(error => ({
          property: error.property,
          message: Object.values(error.constraints ?? {}).join(', '),
        }));
        return new BadRequestException({
          statusCode: 400,
          message: 'Validatsiya xatosi',
          errors: messages,
        });
      },
    }),
  );
  
  // Global xato filtri
  // app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger hujjatlari sozlamalari
  const config = new DocumentBuilder()
    .setTitle('Cyber Market API')
    .setDescription('Cyber Market backend API hujjatlari')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(PORT,() => {  
    console.log(`Server ${PORT} portda ishga tushdi`)
    
   })
}
bootstrap();