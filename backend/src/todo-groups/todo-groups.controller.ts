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
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@ApiTags('Todo Groups')
@Controller('todo-groups')
@UseGuards(JwtAuthGuard)
export class TodoGroupsController {
  constructor(private readonly todoGroupsService: TodoGroupsService) {}

  @ApiOperation({ summary: 'Create Todo group' })
  @Post()
  create(
    @Body() createTodoGroupDto: CreateTodoGroupDto,
    @GetUser() user: User,
  ) {
    return this.todoGroupsService.create(createTodoGroupDto, user);
  }

  @ApiOperation({ summary: 'Find all Todo groups' })
  @Get()
  findAll(@GetUser() user: User) {
    return this.todoGroupsService.findAll(user.id);
  }

  @ApiOperation({ summary: 'Find Todo group by id' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.todoGroupsService.findOne(id, user.id);
  }

  @ApiOperation({ summary: 'Update Todo group by id' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoGroupDto: UpdateTodoGroupDto,
    @GetUser() user: User,
  ) {
    return this.todoGroupsService.update(id, updateTodoGroupDto, user.id);
  }

  @ApiOperation({ summary: 'Delete Todo group by id' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.todoGroupsService.remove(id, user.id);
  }
}
