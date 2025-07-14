import { PartialType } from '@nestjs/mapped-types';
import { CreateLikeDto } from './create-like.dto';

// Like yangilash uchun DTO: CreateLikeDto'dan qisman meros oladi
export class UpdateLikeDto extends PartialType(CreateLikeDto) {}