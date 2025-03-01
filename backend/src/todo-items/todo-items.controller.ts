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
  UseGuards,
} from '@nestjs/common';
import { TodoItemsService } from './todo-items.service';
import { CreateTodoItemDto } from './dtos/create-todo-item.dto';
import { UpdateTodoItemDto } from './dtos/update-todo-item.dto';
import { User } from '../users/entities/user.entity';
import { TodoItemFiltersDto } from './dtos/todo-item-filters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('todo-items')
@UseGuards(JwtAuthGuard)
export class TodoItemsController {
  constructor(private readonly todoItemsService: TodoItemsService) {}

  @Post()
  create(@Body() createTodoItemDto: CreateTodoItemDto, @GetUser() user: User) {
    return this.todoItemsService.create(createTodoItemDto, user);
  }

  @Get()
  findAll(
    @Query('completed', ParseBoolPipe) completed: boolean,
    @Query() filters: TodoItemFiltersDto,
    @GetUser() user: User,
  ) {
    return this.todoItemsService.findAll(user.id, completed, filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.todoItemsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoItemDto: UpdateTodoItemDto,
    @GetUser() user: User,
  ) {
    return this.todoItemsService.update(id, updateTodoItemDto, user.id);
  }

  @Patch(':id/toggle-complete')
  toggleComplete(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.todoItemsService.toggleComplete(id, user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.todoItemsService.remove(id, user.id);
  }
}
