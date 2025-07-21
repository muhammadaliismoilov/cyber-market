import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Put,
  UseGuards,
  Query,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { Roles } from "src/guard/roles.decarator";
import { Product } from "./schema/product.schema";

@ApiTags("Products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post("create_product")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superadmin")
  @UseInterceptors(FileFieldsInterceptor([{ name: "imgs", maxCount: 6 }]))
  @ApiOperation({
    summary: "Yangi mahsulot yaratish",
    description: "Berilgan ma`lumotlar bilan yangi mahsulot yaratadi.",
  })
  @ApiConsumes("multipart/form-data", "aplication/json")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        category_id: { type: "string" },
        title: { type: "string" },
        price: { type: "number" },
        count: { type: "number" },
        color: { type: "string" },
        memory: { type: "string" },
        screen_size: { type: "string" },
        cpu: { type: "string" },
        number_of_cores: { type: "number" },
        main_camera: { type: "string" },
        front_camera: { type: "string" },
        battery_capacity: { type: "string" },
        description: { type: "string" },
        details: { type: "string" },
        screen_resolution: { type: "string" },
        screen_refresh_rate: { type: "string" },
        pixel_density: { type: "string" },
        screen_type: { type: "string" },
        additionally: { type: "string" },
        imgs: {
          type: "array",
          items: { type: "string", format: "binary" },
          maxItems: 6,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Mahsulot muvaffaqiyatli yaratildi.",
  })
  @ApiResponse({
    status: 400,
    description: "Kategoriya ID noto‘g‘ri yoki fayl limiti oshib ketdi.",
  })
  @ApiResponse({ status: 500, description: 'Mahsulot yaratishda serverda kutilmagan xatolik yuz berdi' })
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: { imgs?: Express.Multer.File[] }
  ) {
    return this.productsService.create(createProductDto, files.imgs || []);
  }

  @Get("search_product")
  @ApiOperation({ summary: "Mahsulotlarni filter orqali qidirish" })
  @ApiResponse({
    status: 200,description: "Mahsulotlar ro‘yxati muvaffaqiyatli qaytarildi.",
  })
  @ApiResponse({
    status: 400, description: "So‘rov parametrlari noto‘g‘ri kiritilgan. (Masalan: string o‘rniga number)",
  })
  @ApiResponse({
    status: 404,description: "Bunday mahsulot topilmadi.",
  })
  @ApiResponse({
    status: 500, description: "Ichki server xatosi.",
  })
  @ApiQuery({ name: "title", required: false, description: "Mahsulot nomi" })
  @ApiQuery({
    name: "minPrice",
    required: false,
    type: Number,
    description: "Minimal narx",
  })
  @ApiQuery({
    name: "maxPrice",
    required: false,
    type: Number,
    description: "Maksimal narx",
  })
  @ApiQuery({
    name: "count",
    required: false,
    type: Number,
    description: "Mahsulot soni",
  })
  @ApiQuery({
    name: "color",
    required: false,
    description: "Rang (vergul bilan ajratilgan)",
  })
  @ApiQuery({
    name: "memory",
    required: false,
    description: "Xotira (vergul bilan ajratilgan)",
  })
  async search(@Query() query: any) {
    return this.productsService.search(query);
  }

  @Get("/new-arrival")
  @ApiOperation({
    summary: "Yangi mahsulotlar ro`yxati (New Arrival)",
    description:
      "Eng yangi qo‘shilgan mahsulotlarni sahifalab (5 tadan) chiqaradi.",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    example: 1,
    description: "Sahifa raqami (ixtiyoriy, default = 1)",
  })
  @ApiResponse({
    status: 200,
    description: "Eng yangi mahsulotlar muvaffaqiyatli qaytarildi.",
    schema: {
      example: {
        page: 1,
        total: 12,
        hasNext: true,
        hasPrev: false,
        products: [
          {
            _id: "123456789",
            name: "Mahsulot 1",
            price: 25000,
            createdAt: "2025-07-18T18:15:00.000Z",
          },
          // ...
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,description: "Bunday mahsulot topilmadi.",
  })
  @ApiResponse({
    status: 500, description: "Ichki server xatosi.",
  })
  async getNewArrival(@Query("page") page?: number) {
    return this.productsService.NewArrivle(page || 1);
  }

  @Get("bestsellers")
  @ApiOperation({
    summary: "Eng ko‘p sotilgan mahsulotlar ro‘yxati (BestSeller)",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    example: 1,
    description: "Sahifa raqami (ixtiyoriy, default = 1)",
  })
  async getBestsellers(@Query("page") page: number = 1) {
    return this.productsService.BestSellears(page);
  }

  @Get("get_all_products")
  @ApiOperation({
    summary: "Barcha mahsulotlar",
    description: "Barcha  mahsulotlar ro`yxatini beradi",
  })
  @ApiResponse({ status: 200, description: "Barcha mahsulotlar ro‘yxati." })
  @ApiResponse({
    status: 400,
    description: "Mahsulotlarni olishda  xatolik yuz berdi.",
  })
  @ApiResponse({ status: 500, description: 'Barcha mahsulotlarni olishda serverda kutilmagan xatolik yuz berdi' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get("get_one_product/:id")
  @ApiOperation({
    summary: "Bitta mahsulotni olish",
    description: "Id bo`yicha bitta mahsulotni beradi",
  })
  @ApiResponse({ status: 200, description: "ID bo‘yicha mahsulot topildi." })
  @ApiResponse({ status: 404, description: "Mahsulot topilmadi." })
  @ApiResponse({ status: 500, description: 'Bitta mahsulotni olishda serverda kutilmagan xatolik yuz berdi' })
  @ApiParam({ name: "id", description: "Mahsulot ID raqami" })
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @Put("update_product/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superadmin")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Mahsulotni o`zgartrish",
    description: "Id bo`yicha bitta mahsulotni ma`lumotlarini ozgartradi",
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: "imgs", maxCount: 6 }]))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        category_id: { type: "string" },
        title: { type: "string" },
        price: { type: "number" },
        count: { type: "number" },
        color: { type: "string" },
        memory: { type: "string" },
        screen_size: { type: "string" },
        cpu: { type: "string" },
        number_of_cores: { type: "number" },
        main_camera: { type: "string" },
        front_camera: { type: "string" },
        battery_capacity: { type: "string" },
        description: { type: "string" },
        details: { type: "string" },
        screen_resolution: { type: "string" },
        screen_refresh_rate: { type: "string" },
        pixel_density: { type: "string" },
        screen_type: { type: "string" },
        additionally: { type: "string" },
        imgs: {
          type: "array",
          items: { type: "string", format: "binary" },
          maxItems: 6,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Mahsulot muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Yangilashda xatolik yoki mahsulot topilmadi.",
  })
  @ApiResponse({ status: 500, description: 'Serverda kutilmagan xatolik yuz berdi' })
  update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: { imgs?: Express.Multer.File[] }
  ) {
    return this.productsService.update(id, updateProductDto, files.imgs || []);
  }

  @Delete("delete_product/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superadmin")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Mahsulotni o`chiriadi",
    description: "Id bo`yicha bitta mahsulotni o`chiradi",
  })
  @ApiParam({ name: "id", description: "Mahsulot ID raqami" })
  @ApiResponse({
    status: 200,
    description: "Mahsulot muvaffaqiyatli o‘chirildi.",
  })
  @ApiResponse({ status: 404, description: "Mahsulot topilmadi." })
  @ApiResponse({ status: 500, description: 'Serverda kutilmagan xatolik yuz berdi' })
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }
}
