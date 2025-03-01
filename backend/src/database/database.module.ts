import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../config/database.config';
import { User } from '../users/user.entity';
import { TodoGroup } from '../todo-groups/todo-group.entity';
import { TodoItem } from '../todo-items/todo-item.entity';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
        entities: [User, TodoGroup, TodoItem],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
