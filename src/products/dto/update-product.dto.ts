import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// Mahsulot yangilash uchun DTO: CreateProductDto'dan qisman meros oladi
export class UpdateProductDto extends PartialType(CreateProductDto) {}