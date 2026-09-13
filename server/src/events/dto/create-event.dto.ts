import {
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Min,
} from 'class-validator';

export class CreateEventDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
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
    @IsUrl()
    imageUrl?: string;

    @IsInt()
    @Min(1)
    categoryId: number;

    @IsInt()
    @Min(1)
    cityId: number;
}