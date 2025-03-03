import { Test, TestingModule } from '@nestjs/testing';
import { TodoGroupsService } from './todo-groups.service';
import { TodoGroupsRepository } from './todo-groups.repository';
import { CreateTodoGroupDto } from './dtos/create-todo-group.dto';
import { User } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('TodoGroupsService', () => {
  let service: TodoGroupsService;
  let repository: TodoGroupsRepository;

  const mockTodoGroupsRepository = {
    create: jest.fn(),
    findAllWithCount: jest.fn(),
    findOneWithCount: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoGroupsService,
        { provide: TodoGroupsRepository, useValue: mockTodoGroupsRepository },
      ],
    }).compile();

    service = module.get<TodoGroupsService>(TodoGroupsService);
    repository = module.get<TodoGroupsRepository>(TodoGroupsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo group', async () => {
      const user = new User();
      const createTodoGroupDto: CreateTodoGroupDto = { name: 'Test Group' };
      mockTodoGroupsRepository.create.mockReturnValue(createTodoGroupDto);

      const result = await service.create(createTodoGroupDto, user);
      expect(result).toEqual(createTodoGroupDto);
      expect(mockTodoGroupsRepository.create).toHaveBeenCalledWith(
        createTodoGroupDto,
        user,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of todo groups with count', async () => {
      const userId = 1;
      const todoGroups = [{ name: 'Test Group', todoCount: 2 }];
      mockTodoGroupsRepository.findAllWithCount.mockResolvedValue(todoGroups);

      const result = await service.findAll(userId);
      expect(result).toEqual(todoGroups);
      expect(mockTodoGroupsRepository.findAllWithCount).toHaveBeenCalledWith(
        userId,
      );
    });
  });

  describe('findOne', () => {
    it('should return by id', async () => {
      const userId = 1;
      const todoGroup = { id: 1, name: 'Test Group' };
      mockTodoGroupsRepository.findOneWithCount.mockResolvedValue(todoGroup);

      const result = await service.findOne(1, userId);
      expect(result).toEqual(todoGroup);
      expect(mockTodoGroupsRepository.findOneWithCount).toHaveBeenCalledWith(
        1,
        userId,
      );
    });

    it('should throw NotFoundException if todo group does not exist', async () => {
      const userId = 1;
      mockTodoGroupsRepository.findOneWithCount.mockResolvedValue(null);

      await expect(service.findOne(1, userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockTodoGroupsRepository.findOneWithCount).toHaveBeenCalledWith(
        1,
        userId,
      );
    });
  });
});
