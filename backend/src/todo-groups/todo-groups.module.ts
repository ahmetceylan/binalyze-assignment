import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoGroup } from './entities/todo-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoGroup])],
  exports: [],
})
export class TodoGroupsModule {}
