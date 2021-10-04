import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@UseInterceptors(new SanitizeMongooseModelInterceptor())
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }
}
