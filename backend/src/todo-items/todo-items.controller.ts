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
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@ApiTags('Todo Items')
@Controller('todo-items')
@UseGuards(JwtAuthGuard)
export class TodoItemsController {
  constructor(private readonly todoItemsService: TodoItemsService) {}

  @ApiOperation({ summary: 'Create Todo Item' })
  @Post()
  create(@Body() createTodoItemDto: CreateTodoItemDto, @GetUser() user: User) {
    return this.todoItemsService.create(createTodoItemDto, user);
  }

  @ApiOperation({ summary: 'Find all Todo Items' })
  @Get()
  findAll(
    @Query('completed', ParseBoolPipe) completed: boolean,
    @Query() filters: TodoItemFiltersDto,
    @GetUser() user: User,
  ) {
    return this.todoItemsService.findAll(user.id, completed, filters);
  }

  @ApiOperation({ summary: 'Find Todo Item by id' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.todoItemsService.findOne(id, user.id);
  }

  @ApiOperation({ summary: 'Update Todo Item by id' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoItemDto: UpdateTodoItemDto,
    @GetUser() user: User,
  ) {
    return this.todoItemsService.update(id, updateTodoItemDto, user.id);
  }

  @ApiOperation({ summary: 'Toggle Todo Item complete field' })
  @Patch(':id/toggle-complete')
  toggleComplete(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.todoItemsService.toggleComplete(id, user.id);
  }

  @ApiOperation({ summary: 'Delete Todo Item by id' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.todoItemsService.remove(id, user.id);
  }
}
