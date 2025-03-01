import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { TodoItemsModule } from './todo-items/todo-items.module';
import { TodoGroupsModule } from './todo-groups/todo-groups.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    DatabaseModule,
    UsersModule,
    TodoItemsModule,
    TodoGroupsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
