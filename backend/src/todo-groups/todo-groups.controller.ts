import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TodoGroupsService } from './todo-groups.service';
import { CreateTodoGroupDto } from './dtos/create-todo-group.dto';
import { UpdateTodoGroupDto } from './dtos/update-todo-group.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('todo-groups')
export class TodoGroupsController {
  constructor(private readonly todoGroupsService: TodoGroupsService) {}

  @Post()
  create(@Body() createTodoGroupDto: CreateTodoGroupDto) {
    // TODO: Get user from request
    const mockUser = { id: 1, email: 'test@test.com' } as User;
    return this.todoGroupsService.create(createTodoGroupDto, mockUser);
  }

  @Get()
  findAll() {
    // TODO: Get user from request
    const mockUserId = 1;
    return this.todoGroupsService.findAll(mockUserId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    // TODO: Get user from request
    const mockUserId = 1;
    return this.todoGroupsService.findOne(id, mockUserId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoGroupDto: UpdateTodoGroupDto,
  ) {
    // TODO: Get user from request
    const mockUserId = 1;
    return this.todoGroupsService.update(id, updateTodoGroupDto, mockUserId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    // TODO: Get user from request
    const mockUserId = 1;
    return this.todoGroupsService.remove(id, mockUserId);
  }
}
