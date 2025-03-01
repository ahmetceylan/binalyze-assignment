import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { TodoItemsService } from './todo-items.service';
import { CreateTodoItemDto } from './dtos/create-todo-item.dto';
import { UpdateTodoItemDto } from './dtos/update-todo-item.dto';
import { User } from '../users/entities/user.entity';
import { TodoItemFiltersDto } from './dtos/todo-item-filters.dto';

@Controller('todo-items')
export class TodoItemsController {
  constructor(private readonly todoItemsService: TodoItemsService) {}

  @Post()
  create(@Body() createTodoItemDto: CreateTodoItemDto) {
    // TODO: Get user from request
    const mockUser = { id: 1, email: 'test@test.com' } as User;
    return this.todoItemsService.create(createTodoItemDto, mockUser);
  }

  @Get()
  findAll(
    @Query('completed', ParseBoolPipe) completed: boolean,
    @Query('groupId', ParseIntPipe) groupId?: number,
    @Query('priority', ParseIntPipe) priority?: number,
    @Query('dueDateStart') dueDateStart?: string,
    @Query('dueDateEnd') dueDateEnd?: string,
  ) {
    // TODO: Get user from request
    const mockUserId = 1;
    const filters: TodoItemFiltersDto = {
      groupId,
      priority,
      dueDateStart: dueDateStart ? new Date(dueDateStart) : undefined,
      dueDateEnd: dueDateEnd ? new Date(dueDateEnd) : undefined,
    };
    return this.todoItemsService.findAll(mockUserId, completed, filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    // TODO: Get user from request
    const mockUserId = 1;
    return this.todoItemsService.findOne(id, mockUserId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoItemDto: UpdateTodoItemDto,
  ) {
    // TODO: Get user from request
    const mockUserId = 1;
    return this.todoItemsService.update(id, updateTodoItemDto, mockUserId);
  }

  @Patch(':id/toggle-complete')
  toggleComplete(@Param('id', ParseIntPipe) id: number) {
    // TODO: Get user from request
    const mockUserId = 1;
    return this.todoItemsService.toggleComplete(id, mockUserId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    // TODO: Get user from request
    const mockUserId = 1;
    return this.todoItemsService.remove(id, mockUserId);
  }
}
