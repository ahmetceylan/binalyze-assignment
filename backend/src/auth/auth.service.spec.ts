import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUsersService = {
    findUserByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token if credentials are valid', async () => {
      const user = { id: 1, email: 'john@test.com', password: '123456' };
      //   const payload = { email: user.email, sub: user.userId };
      const hashedPassword = await bcrypt.hash(user.password, 10);
      mockUsersService.findUserByEmail.mockResolvedValue({
        ...user,
        password: hashedPassword,
      });
      jest.spyOn(service['jwtService'], 'signAsync').mockResolvedValue('token');

      const result = await service.login({
        email: user.email,
        password: user.password,
      } as LoginUserDto);

      expect(result).toEqual({
        message: 'Login successfull',
        success: true,
        access_token: 'token',
      });
      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(user.email);
    });

    it('should throw UnauthorizedException, creds is not valid', async () => {
      mockUsersService.findUserByEmail.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'invalid',
          password: 'test',
        } as LoginUserDto),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith('invalid');
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const user = { userId: 1, email: 'john@test.com', password: '123456' };
      mockUsersService.findUserByEmail.mockResolvedValue(user);

      await expect(
        service.login({
          email: user.email,
          password: 'invalid',
        } as LoginUserDto),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(user.email);
    });
  });
});
