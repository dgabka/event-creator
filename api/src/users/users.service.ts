import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hash = await bcrypt.hash(
      createUserDto.password,
      await bcrypt.genSalt(),
    );
    const userToSave = { ...createUserDto, password: hash };
    try {
      const createdUser = await this.userModel.create(userToSave);
      return createdUser;
    } catch (e) {
      if (e.code === 11000 && e.keyPattern.email) {
        throw new ConflictException('Email address must be unique');
      } else {
        throw e;
      }
    }
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }
}
