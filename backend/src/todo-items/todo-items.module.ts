import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItem } from './entities/todo-item.entity';
import { TodoGroup } from '../todo-groups/entities/todo-group.entity';
import { TodoItemsService } from './todo-items.service';
import { TodoItemsController } from './todo-items.controller';
import { TodoItemsRepository } from './todo-items.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TodoItem, TodoGroup])],
  controllers: [TodoItemsController],
  providers: [TodoItemsService, TodoItemsRepository],
  exports: [TodoItemsService],
})
export class TodoItemsModule {}
