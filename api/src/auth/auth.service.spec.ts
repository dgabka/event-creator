jest.mock('bcrypt', () => ({
  compare: jest.fn((password, hash) => {
    return password === hash;
  }),
}));
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return null if user is not found', async () => {
      mockUserService.findOne.mockReturnValueOnce(null);
      await expect(service.validateUser('', '')).resolves.toBeNull();
    });

    it('should return null if passwords do not match', async () => {
      mockUserService.findOne.mockReturnValueOnce({
        email: 'email',
        password: 'test',
      });
      await expect(
        service.validateUser('email', 'invalidPass'),
      ).resolves.toBeNull();
    });

    it('should return found user if user is found and password is valid', async () => {
      mockUserService.findOne.mockReturnValueOnce({
        email: 'email',
        password: 'test',
      });
      await expect(
        service.validateUser('email', 'test'),
      ).resolves.toMatchObject({ email: 'email' });
    });
  });

  describe('login', () => {
    it('should return access token', () => {
      const user = {
        email: 'email',
        _id: '123',
      };
      mockJwtService.sign.mockReturnValueOnce('123');
      expect(service.login(user)).toMatchObject({
        access_token: expect.any(String),
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user._id,
      });
    });
  });
});
