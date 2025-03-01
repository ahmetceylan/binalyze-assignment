import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItem } from './entities/todo-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoItem])],
  exports: [],
})
export class TodoItemsModule {}
