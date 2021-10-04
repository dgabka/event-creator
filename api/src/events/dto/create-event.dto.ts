import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  readonly firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(32)
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  @IsDate()
  readonly date: Date;
}
