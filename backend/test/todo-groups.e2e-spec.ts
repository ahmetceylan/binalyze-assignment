import { Test, TestingModule } from '@nestjs/testing';
// import { TodoGroupsModule } from './../src/todo-groups/todo-groups.module';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
// import { TodoGroupsModule } from '../src/todo-groups/todo-groups.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoGroup } from '../src/todo-groups/entities/todo-group.entity';
import { TodoGroupsRepository } from '../src/todo-groups/todo-groups.repository';
import { TodoGroupsService } from '../src/todo-groups/todo-groups.service';
import { TodoGroupsModule } from '../src/todo-groups/todo-groups.module';
import { TodoItem } from '../src/todo-items/entities/todo-item.entity';
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

describe('TodoGroups (e2e)', () => {
  let app: INestApplication;
  const mockTodoGroupsRepository = {
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
        TodoGroupsModule,
      ],
      providers: [
        TodoGroupsService,
        // TodoGroupsRepository,
        { provide: TodoGroupsRepository, useValue: mockTodoGroupsRepository },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/todo-groups (GET)', () => {
    return request(app.getHttpServer()).get('/todo-groups').expect(200);
  });

  it('/todo-groups (POST)', async () => {
    const newGroup = { name: 'New Group' };
    return request(app.getHttpServer())
      .post('/todo-groups')
      .send(newGroup)
      .expect(201)
      .then((response) => {
        expect(response.body.name).toEqual(newGroup.name);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
