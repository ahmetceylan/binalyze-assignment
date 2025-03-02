import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Between,
  LessThanOrEqual,
  MoreThanOrEqual,
  FindOptionsWhere,
} from 'typeorm';
import { TodoItem } from './entities/todo-item.entity';
import { CreateTodoItemDto } from './dtos/create-todo-item.dto';
import { UpdateTodoItemDto } from './dtos/update-todo-item.dto';
import { User } from '../users/entities/user.entity';
import { TodoGroup } from '../todo-groups/entities/todo-group.entity';
import { TodoItemFiltersDto } from './dtos/todo-item-filters.dto';

@Injectable()
export class TodoItemsRepository {
  constructor(
    @InjectRepository(TodoItem)
    private todoItemsRepository: Repository<TodoItem>,
    @InjectRepository(TodoGroup)
    private todoGroupsRepository: Repository<TodoGroup>,
  ) {}

  async create(
    createTodoItemDto: CreateTodoItemDto,
    user: User,
  ): Promise<TodoItem> {
    const group = await this.todoGroupsRepository.findOne({
      where: { id: createTodoItemDto.groupId, user: { id: user.id } },
    });

    const todoItem = this.todoItemsRepository.create({
      ...createTodoItemDto,
      user,
      group,
    });

    return await this.todoItemsRepository.save(todoItem);
  }

  async findAll(
    userId: number,
    filters?: TodoItemFiltersDto,
  ): Promise<TodoItem[]> {
    console.log('AHMET : ', filters);
    const where: FindOptionsWhere<TodoItem> = {
      user: { id: userId },
    };

    if (filters?.completed !== undefined && filters?.completed !== null) {
      where.completed = filters.completed;
    }

    if (filters?.groupId) {
      where.group = { id: filters.groupId };
    }

    if (filters?.priority) {
      where.priority = filters.priority;
    }

    if (filters?.dueDateStart && filters?.dueDateEnd) {
      where.due_date = Between(filters.dueDateStart, filters.dueDateEnd);
    } else if (filters?.dueDateStart) {
      where.due_date = MoreThanOrEqual(filters.dueDateStart);
    } else if (filters?.dueDateEnd) {
      where.due_date = LessThanOrEqual(filters.dueDateEnd);
    }

    return await this.todoItemsRepository.find({
      where,
      relations: ['group', 'user'],
      order: {
        priority: 'DESC',
        due_date: 'ASC',
      },
    });
  }

  async findOne(id: number, userId: number): Promise<TodoItem> {
    return await this.todoItemsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['group', 'user'],
    });
  }

  async update(
    id: number,
    updateTodoItemDto: UpdateTodoItemDto,
  ): Promise<TodoItem> {
    const updateData: any = { ...updateTodoItemDto };

    if (updateTodoItemDto.groupId) {
      const group = await this.todoGroupsRepository.findOne({
        where: { id: updateTodoItemDto.groupId },
      });
      updateData.group = group;
      delete updateData.groupId;
    }

    if (updateTodoItemDto.completed) {
      updateData.completed_at = new Date();
    } else if (updateTodoItemDto.completed === false) {
      updateData.completed_at = null;
    }

    await this.todoItemsRepository.update(id, updateData);
    return await this.todoItemsRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.todoItemsRepository.delete(id);
  }
}
