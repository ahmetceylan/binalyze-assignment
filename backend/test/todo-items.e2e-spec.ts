import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemsModule } from '../src/todo-items/todo-items.module';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItem } from '../src/todo-items/entities/todo-item.entity';
import { TodoGroup } from '../src/todo-groups/entities/todo-group.entity';
import { TodoItemsRepository } from '../src/todo-items/todo-items.repository';
import { TodoItemsService } from '../src/todo-items/todo-items.service';
import { User } from '../src/users/entities/user.entity';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
// Mock JwtAuthGuard to always return true
class MockJwtAuthGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    request.user = { id: 1, email: 'john@test.com' };
    return true;
  }
}

describe('TodoItems (e2e)', () => {
  let app: INestApplication;

  const mockTodoItemsRepository = {
    create: jest.fn(),
    findAllWithCount: jest.fn(),
    findOneWithCount: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'ahmetceylan',
          password: '123456',
          database: 'todo_list',
          entities: [User, TodoGroup, TodoItem],
        }),
        TodoItemsModule,
      ],
      providers: [
        TodoItemsService,
        // TodoGroupsRepository,
        { provide: TodoItemsRepository, useValue: mockTodoItemsRepository },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/todo-items (GET)', () => {
    return request(app.getHttpServer()).get('/todo-items').expect(200);
  });

  it('/todo-items (POST)', async () => {
    const newItem = {
      title: 'New Item',
      groupId: 1,
      priority: 1,
      due_date: '2025-03-20T21:00:00.000Z',
    };
    return request(app.getHttpServer())
      .post('/todo-items')
      .send(newItem)
      .expect(201)
      .then((response) => {
        expect(response.body.title).toEqual(newItem.title);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
