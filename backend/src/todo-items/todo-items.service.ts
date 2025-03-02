import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TodoItemsRepository } from './todo-items.repository';
import { CreateTodoItemDto } from './dtos/create-todo-item.dto';
import { UpdateTodoItemDto } from './dtos/update-todo-item.dto';
import { User } from '../users/entities/user.entity';
import { TodoItemFiltersDto } from './dtos/todo-item-filters.dto';

@Injectable()
export class TodoItemsService {
  private readonly logger = new Logger(TodoItemsService.name);

  constructor(private readonly todoItemsRepository: TodoItemsRepository) {}

  async create(createTodoItemDto: CreateTodoItemDto, user: User) {
    this.logger.log(`Creating new todo item for user: ${user.email}`);
    return await this.todoItemsRepository.create(createTodoItemDto, user);
  }

  async findAll(userId: number, filters?: TodoItemFiltersDto) {
    return await this.todoItemsRepository.findAll(userId, filters);
  }

  async findOne(id: number, userId: number) {
    const item = await this.todoItemsRepository.findOne(id, userId);
    if (!item) {
      throw new NotFoundException(`Todo item with ID ${id} not found`);
    }
    return item;
  }

  async update(
    id: number,
    updateTodoItemDto: UpdateTodoItemDto,
    userId: number,
  ) {
    await this.findOne(id, userId);
    return await this.todoItemsRepository.update(id, updateTodoItemDto);
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    await this.todoItemsRepository.remove(id);
  }

  async toggleComplete(id: number, userId: number) {
    const item = await this.findOne(id, userId);
    return await this.todoItemsRepository.update(id, {
      completed: !item.completed,
    });
  }
}
