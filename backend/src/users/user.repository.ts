import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createNewUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
