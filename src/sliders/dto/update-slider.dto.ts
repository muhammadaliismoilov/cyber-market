import { PartialType } from '@nestjs/mapped-types';
import { CreateSliderDto } from './create-slider.dto';

// Slider yangilash uchun DTO: CreateSliderDto'dan qisman meros oladi
export class UpdateSliderDto extends PartialType(CreateSliderDto) {}