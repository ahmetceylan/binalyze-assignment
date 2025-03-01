import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TodoGroupsService } from './todo-groups.service';
import { CreateTodoGroupDto } from './dtos/create-todo-group.dto';
import { UpdateTodoGroupDto } from './dtos/update-todo-group.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('todo-groups')
@UseGuards(JwtAuthGuard)
export class TodoGroupsController {
  constructor(private readonly todoGroupsService: TodoGroupsService) {}

  @Post()
  create(
    @Body() createTodoGroupDto: CreateTodoGroupDto,
    @GetUser() user: User,
  ) {
    return this.todoGroupsService.create(createTodoGroupDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.todoGroupsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.todoGroupsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoGroupDto: UpdateTodoGroupDto,
    @GetUser() user: User,
  ) {
    return this.todoGroupsService.update(id, updateTodoGroupDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.todoGroupsService.remove(id, user.id);
  }
}
