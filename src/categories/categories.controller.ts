import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";
import { RolesGuard } from "src/guard/roles.guard";
import { Roles } from "src/guard/roles.decarator";

// Kategoriyalar bo‘limi uchun Swagger tegi
@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Yangi kategoriya yaratish
  @Post("create_categorie")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superadmin")
  @ApiOperation({
    summary: "Yangi kategoriya yaratish",
    description: "Berilgan sarlavha bilan yangi kategoriya yaratadi.",
  })
  @ApiBody({
    type: CreateCategoryDto,
    description: "Yangi kategoriya yaratish uchun ma’lumotlar",
    examples: {
      misol1: {
        summary: "Kategoriya yaratish misoli",
        value: { title: "Elektronika" },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Kategoriya muvaffaqiyatli yaratildi.",
    type: CreateCategoryDto,
  })
  @ApiResponse({
    status: 400,
    description:
      "Noto‘g‘ri so‘rov, kategoriya allaqachon mavjud yoki ma’lumotlar xato.",
  })@ApiResponse({ status: 500, description: 'Serverda kutilmagan xatolik yuz berdi' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // Barcha kategoriyalarni olish
  @Get("get_all_categories")
  @ApiOperation({
    summary: "Barcha kategoriyalarni olish",
    description: "Barcha kategoriyalar ro‘yxatini qaytaradi.",
  })
  @ApiResponse({
    status: 200,
    description: "Barcha kategoriyalar muvaffaqiyatli olindi.",
    type: [CreateCategoryDto],
  })
  @ApiResponse({
    status: 400,
    description: "Kategoriyalarni olishda xatolik yuz berdi.",
  })
  @ApiResponse({ status: 500, description: 'Serverda kutilmagan xatolik yuz berdi' })
  async findAll() {
    return this.categoriesService.findAll();
  }

  // ID bo‘yicha bitta kategoriyani olish
  @Get("find_one_categorie/:id")
  @ApiOperation({
    summary: "Kategoriyani ID bo‘yicha olish",
    description: "Berilgan ID bo‘yicha bitta kategoriyani qaytaradi.",
  })
  @ApiResponse({
    status: 200,
    description: "Kategoriya muvaffaqiyatli topildi.",
    type: CreateCategoryDto,
  })
  @ApiResponse({ status: 404, description: "Kategoriya topilmadi." })
  async findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id);
  }

@Get('search/categorie')
@ApiOperation({ summary: 'Kategoriya nomi orqali mahsulotlarni topish' })
@ApiQuery({ name: 'title', required: true, description: 'Kategoriya nomi (qisman moslik)' })
@ApiResponse({
  status: 200,
  description: 'Kategoriya va unga tegishli mahsulotlar muvaffaqiyatli topildi',
})
@ApiResponse({
  status: 404,
  description: 'Kategoriya yoki mahsulotlar topilmadi',
})
@ApiResponse({
  status: 400,
  description: 'So‘rov noto‘g‘ri kiritilgan',
})
@ApiResponse({
  status: 500,
  description: 'Serverda kutilmagan xatolik yuz berdi',
})
async search(@Query('title') title: string) {
  return this.categoriesService.searchByTitle(title);
}

  // Kategoriyani yangilash
  @Put("update_categorie/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superadmin")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Kategoriyani yangilash",
    description: "Berilgan ID bo‘yicha mavjud kategoriyani yangilaydi.",
  })
  @ApiBody({
    type: UpdateCategoryDto,
    description: "Kategoriyani yangilash uchun ma’lumotlar",
    examples: {
      misol1: {
        summary: "Kategoriyani yangilash misoli",
        value: { title: "Yangilangan Elektronika" },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Kategoriya muvaffaqiyatli yangilandi.",
    type: UpdateCategoryDto,
  })
  @ApiResponse({
    status: 400,
    description: "Noto‘g‘ri so‘rov yoki kategoriya topilmadi.",
  })
  async update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // Kategoriyani o‘chirish
  @Delete("delete_categorie/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "superadmin")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Kategoriyani    o‘chirish",
    description: "Berilgan ID bo‘yicha kategoriyani o‘chiradi.",
  })
  @ApiResponse({
    status: 200,
    description: "Kategoriya muvaffaqiyatli o‘chirildi.",
  })
  @ApiResponse({ status: 404, description: "Kategoriya topilmadi." })
  async remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
}
