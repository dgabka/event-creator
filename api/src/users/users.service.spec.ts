import { ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => 'pswdhash'),
  genSalt: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  const user = {
    firstName: 'Dawid',
    lastName: 'Gabka',
    email: 'test@example.com',
    password: '123',
  };

  const mockModel = {
    create: jest.fn((user) => ({ ...user, _id: '123' })),
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
});
