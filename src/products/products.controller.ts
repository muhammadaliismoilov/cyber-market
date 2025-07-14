import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'imgs', maxCount: 4 }, // Maksimum 4 rasm
  ]))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        category_id: { type: 'string' },
        title: { type: 'string' },
        price: { type: 'number' },
        color: { type: 'string' },
        memory: { type: 'string' },
        screen_size: { type: 'string' },
        cpu: { type: 'string' },
        number_of_cores: { type: 'number' },
        main_camera: { type: 'string' },
        front_camera: { type: 'string' },
        battery_capacity: { type: 'string' },
        description: { type: 'string' },
        details: { type: 'string' },
        screen_resolution: { type: 'string' },
        screen_refresh_rate: { type: 'string' },
        pixel_density: { type: 'string' },
        screen_type: { type: 'string' },
        additionally: { type: 'string' },
        imgs: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          maxItems: 4,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Product successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid category ID or too many images.' })
  create(@Body() createProductDto: CreateProductDto, @UploadedFiles() files: { imgs?: Express.Multer.File[] }) {
    return this.productsService.create(createProductDto, files.imgs || []);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Returns all products.' })
  @ApiResponse({ status: 400, description: 'Error fetching products.' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Returns a single product by ID.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'imgs', maxCount: 4 }, // Maksimum 4 rasm
  ]))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        category_id: { type: 'string' },
        title: { type: 'string' },
        price: { type: 'number' },
        color: { type: 'string' },
        memory: { type: 'string' },
        screen_size: { type: 'string' },
        cpu: { type: 'string' },
        number_of_cores: { type: 'number' },
        main_camera: { type: 'string' },
        front_camera: { type: 'string' },
        battery_capacity: { type: 'string' },
        description: { type: 'string' },
        details: { type: 'string' },
        screen_resolution: { type: 'string' },
        screen_refresh_rate: { type: 'string' },
        pixel_density: { type: 'string' },
        screen_type: { type: 'string' },
        additionally: { type: 'string' },
        imgs: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          maxItems: 4,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Product successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request or product not found.' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFiles() files: { imgs?: Express.Multer.File[] }) {
    return this.productsService.update(id, updateProductDto, files.imgs || []);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Product successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}