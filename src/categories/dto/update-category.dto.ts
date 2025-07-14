import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

// Kategoriya yangilash uchun DTO: CreateCategoryDto'dan qisman meros oladi
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}