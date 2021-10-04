import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const user: CreateUserDto = {
    firstName: 'Dawid',
    lastName: 'Gabka',
    email: 'test@example.com',
    password: '123',
  };

  const mockService = {
    create: jest.fn((u) => u),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create new user', async () => {
      await expect(controller.create(user)).resolves.toMatchObject(user);
    });
  });
});
