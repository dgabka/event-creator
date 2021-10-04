import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  @IsDate()
  readonly date: string;
}
