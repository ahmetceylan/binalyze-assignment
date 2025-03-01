import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoGroup } from './entities/todo-group.entity';
import { CreateTodoGroupDto } from './dtos/create-todo-group.dto';
import { UpdateTodoGroupDto } from './dtos/update-todo-group.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TodoGroupsRepository {
  constructor(
    @InjectRepository(TodoGroup)
    private todoGroupsRepository: Repository<TodoGroup>,
  ) {}

  async create(
    createTodoGroupDto: CreateTodoGroupDto,
    user: User,
  ): Promise<TodoGroup> {
    const todoGroup = this.todoGroupsRepository.create({
      ...createTodoGroupDto,
      user,
    });
    return await this.todoGroupsRepository.save(todoGroup);
  }

  async findAll(userId: number): Promise<TodoGroup[]> {
    return await this.todoGroupsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findOne(id: number, userId: number): Promise<TodoGroup> {
    return await this.todoGroupsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });
  }

  async update(
    id: number,
    updateTodoGroupDto: UpdateTodoGroupDto,
  ): Promise<TodoGroup> {
    await this.todoGroupsRepository.update(id, updateTodoGroupDto);
    return await this.todoGroupsRepository.findOne({ where: { id } }); // return updated
  }

  async remove(id: number): Promise<void> {
    await this.todoGroupsRepository.delete(id);
  }
}
