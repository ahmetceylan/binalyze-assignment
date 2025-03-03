import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterResponseDto } from './dtos/register-response.dto';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginResponseDto } from './dtos/login-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findUserByEmail(loginUserDto.email);

    if (!user) {
      this.logger.warn(`Login:email could not be found: ${loginUserDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log('AHMET user: ', user.password);
    console.log('AHMET loginUserDto: ', loginUserDto.password);
    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    console.log('AHMET isPasswordValid: ', isPasswordValid);
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for email: ${loginUserDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    this.logger.log(`User logged in successfully: ${loginUserDto.email}`);

    return {
      message: 'Login successfull',
      success: true,
      access_token,
    };
  }

  async register(createUserDto: CreateUserDto): Promise<RegisterResponseDto> {
    try {
      const user = await this.usersService.create(createUserDto);
      return {
        message: 'User registered successfully',
        userId: user.id,
        success: true,
      };
    } catch (error) {
      this.logger.error('Error while user register! Msg:', error.message);
      throw error;
    }
  }
}
