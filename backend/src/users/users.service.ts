import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './user.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findUserByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      this.logger.warn(
        `User registration attempted with existing email: ${createUserDto.email}`,
      );
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.usersRepository.createNewUser({
      ...createUserDto,
      password: hashedPassword,
    });

    this.logger.log(`Created new user with email: ${user.email}`);
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findUserByEmail(email);
  }
}
