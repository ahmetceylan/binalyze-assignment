import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemsService } from './todo-items.service';
import { TodoItemsRepository } from './todo-items.repository';
import { User } from '../users/entities/user.entity';
import { CreateTodoItemDto } from './dtos/create-todo-item.dto';
import { NotFoundException } from '@nestjs/common';

describe('TodoItemsService', () => {
  let service: TodoItemsService;
  let repository: TodoItemsRepository;

  const mockTodoItemsRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoItemsService,
        { provide: TodoItemsRepository, useValue: mockTodoItemsRepository },
      ],
    }).compile();

    service = module.get<TodoItemsService>(TodoItemsService);
    repository = module.get<TodoItemsRepository>(TodoItemsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo item', async () => {
      const user = new User();
      const createTodoItemDto = {
        title: 'Test Item',
        groupId: 1,
      } as CreateTodoItemDto;
      mockTodoItemsRepository.create.mockReturnValue(createTodoItemDto);

      const result = await service.create(createTodoItemDto, user);
      expect(result).toEqual(createTodoItemDto);
      expect(mockTodoItemsRepository.create).toHaveBeenCalledWith(
        createTodoItemDto,
        user,
      );
    });
  });

  describe('findAll', () => {
    it('should returntodo items', async () => {
      const userId = 1;
      const filters = {};
      const todoItems = [{ title: 'Test Item 1' }, { title: 'Test Item 2' }];
      mockTodoItemsRepository.findAll.mockResolvedValue(todoItems);

      const result = await service.findAll(userId, filters);
      expect(result).toEqual(todoItems);
      expect(mockTodoItemsRepository.findAll).toHaveBeenCalledWith(
        userId,
        filters,
      );
    });
  });

  describe('findOne', () => {
    it('should return a todo item by id', async () => {
      const userId = 1;
      const todoItem = { id: 1, title: 'Test Item', groupId: 1 };
      mockTodoItemsRepository.findOne.mockResolvedValue(todoItem);

      const result = await service.findOne(1, userId);
      expect(result).toEqual(todoItem);
      expect(mockTodoItemsRepository.findOne).toHaveBeenCalledWith(1, userId);
    });

    it('should throw NotFoundException if does not exist', async () => {
      const userId = 1;
      mockTodoItemsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1, userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockTodoItemsRepository.findOne).toHaveBeenCalledWith(1, userId);
    });
  });

  describe('update', () => {
    it('should update a todo item', async () => {
      const userId = 1;
      const updateTodoItemDto = { title: 'Updated Item' };
      const todoItem = { id: 1, title: 'Test Item', groupId: 1 };
      mockTodoItemsRepository.findOne.mockResolvedValue(todoItem);
      mockTodoItemsRepository.update.mockResolvedValue(todoItem);

      const result = await service.update(1, updateTodoItemDto, userId);
      expect(result).toEqual(todoItem);
      expect(mockTodoItemsRepository.update).toHaveBeenCalledWith(
        1,
        updateTodoItemDto,
      );
    });

    it('should throw NotFoundException if todo item does not exist', async () => {
      const userId = 1;
      const updateTodoItemDto = { title: 'Updated Item' };
      mockTodoItemsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(1, updateTodoItemDto, userId),
      ).rejects.toThrow(NotFoundException);
      expect(mockTodoItemsRepository.findOne).toHaveBeenCalledWith(1, userId);
    });
  });
});
