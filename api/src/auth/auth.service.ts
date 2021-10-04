import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUsersCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findOne(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        delete user.password;
        return user;
      }
    }
    return null;
  }

  login(user: any) {
    const payload = { sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
