import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  readonly firstName: string;

  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
