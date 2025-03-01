import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TodoGroupsRepository } from './todo-groups.repository';
import { CreateTodoGroupDto } from './dtos/create-todo-group.dto';
import { UpdateTodoGroupDto } from './dtos/update-todo-group.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TodoGroupsService {
  private readonly logger = new Logger(TodoGroupsService.name);

  constructor(private readonly todoGroupsRepository: TodoGroupsRepository) {}

  async create(createTodoGroupDto: CreateTodoGroupDto, user: User) {
    this.logger.log(`Create new todo group for user: ${user.email}`);
    return await this.todoGroupsRepository.create(createTodoGroupDto, user);
  }

  async findAll(userId: number) {
    return await this.todoGroupsRepository.findAll(userId);
  }

  async findOne(id: number, userId: number) {
    const group = await this.todoGroupsRepository.findOne(id, userId);
    if (!group) {
      throw new NotFoundException(`Todo group with ID ${id} not found`);
    }
    return group;
  }

  async update(
    id: number,
    updateTodoGroupDto: UpdateTodoGroupDto,
    userId: number,
  ) {
    const group = await this.todoGroupsRepository.findOne(id, userId);
    if (!group) {
      throw new NotFoundException(`Todo group with ID ${id} not found`);
    }
    return await this.todoGroupsRepository.update(id, updateTodoGroupDto);
  }

  async remove(id: number, userId: number) {
    const group = await this.todoGroupsRepository.findOne(id, userId);
    if (!group) {
      throw new NotFoundException(`Todo group with ID ${id} not found`);
    }
    await this.todoGroupsRepository.remove(id);
  }
}
