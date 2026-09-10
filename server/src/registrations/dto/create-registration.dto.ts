import { IsInt, Min } from 'class-validator';

export class CreateRegistrationDto {
  @IsInt()
  @Min(1)
  eventId: number;
}
