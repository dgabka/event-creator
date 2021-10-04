jest.mock('bcrypt', () => ({
  hash: jest.fn(() => 'pswdhash'),
  genSalt: jest.fn(),
}));

import { ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const user = {
    firstName: 'Dawid',
    lastName: 'Gabka',
    email: 'gabka.daw@gmail.com',
    password: '123',
  };

  const mockModel = {
    create: jest.fn((user) => ({ ...user, _id: '123' })),
    findOne: jest.fn((email) => ({
      exec: jest.fn(() => user),
    })),
    find: jest.fn(() => [user]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create user', async () => {
      await expect(service.create(user)).resolves.toMatchObject({
        ...user,
        password: 'pswdhash',
      });
    });

    it('should throw conflict error if email is not unique', async () => {
      mockModel.create.mockRejectedValueOnce({
        code: 11000,
        keyPattern: { email: 1 },
      });
      await expect(service.create(user)).rejects.toThrowError(
        ConflictException,
      );
    });

    it('should rethrow error in case of not expected exception', async () => {
      const err = new Error('mock');
      mockModel.create.mockRejectedValueOnce(err);
      await expect(service.create(user)).rejects.toThrowError(err);
    });
  });

  describe('findOne', () => {
    it('should return found user', async () => {
      await expect(service.findOne(user.email)).resolves.toMatchObject(user);
    });
  });

  describe('findAll', () => {
    it('should return found users', async () => {
      await expect(service.findAll()).resolves.toMatchObject([user]);
    });
  });
});