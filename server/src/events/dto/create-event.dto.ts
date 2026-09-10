import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  address: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsInt()
  categoryId: number;

  @IsInt()
  cityId: number;
}
