import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
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

  /*
    - at least 8 characters
    - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
    - Can contain special characters
  */
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  readonly password: string;
}
