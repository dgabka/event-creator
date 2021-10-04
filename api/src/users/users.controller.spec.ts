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
    email: 'gabka.daw@gmail.com',
    password: '123',
  };

  const mockService = {
    create: jest.fn((u) => u),
    findOne: jest.fn((email) => ({ ...user, _id: '123' })),
    findAll: jest.fn(() => [user]),
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

  describe('findByEmail', () => {
    it('should return found user', async () => {
      await expect(controller.findByEmail(user.email)).resolves.toMatchObject({
        ...user,
        _id: expect.any(String),
      });
    });

    it('should throw if user was not found', async () => {
      mockService.findOne.mockImplementationOnce((email) => null);
      await expect(controller.findByEmail(user.email)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return list of users', async () => {
      await expect(controller.findAll()).resolves.toMatchObject([user]);
    });
  });
});
