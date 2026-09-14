import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsInt,
    IsString,
    Min,
} from 'class-validator';

export class CreateSquadDto {
    @IsInt()
    @Min(1)
    cityId: number;

    @IsInt()
    @Min(1)
    categoryId: number;

    @IsInt()
    @Min(2)
    groupSizeMin: number;

    @IsInt()
    @Min(2)
    groupSizeMax: number;

    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    interests: string[];
}