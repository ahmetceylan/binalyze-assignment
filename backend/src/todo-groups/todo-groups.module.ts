import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoGroup } from './entities/todo-group.entity';
import { TodoGroupsService } from './todo-groups.service';
import { TodoGroupsController } from './todo-groups.controller';
import { TodoGroupsRepository } from './todo-groups.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TodoGroup])],
  controllers: [TodoGroupsController],
  providers: [TodoGroupsService, TodoGroupsRepository],
  exports: [TodoGroupsService],
})
export class TodoGroupsModule {}
