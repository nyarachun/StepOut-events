import {
  IsInt,
  IsString,
  Min,
} from 'class-validator';

export class CreateEventChatDto {
  @IsInt()
  @Min(1)
  eventId: number;

  @IsString()
  message: string;
}