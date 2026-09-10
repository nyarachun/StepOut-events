import { IsString, MinLength } from 'class-validator';

export class CreateCityDto {
  @IsString()
  @MinLength(2)
  name: string;
}
