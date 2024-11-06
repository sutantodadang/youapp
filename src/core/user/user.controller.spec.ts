import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserInterestDto } from './dto/create-user-interest.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import mongoose from 'mongoose';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  // Mock user service
  const mockUserService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    upsertInterest: jest.fn(),
  };

  // Mock JWT guard
  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockImplementation(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user profile', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        age: 25,
        height: 175,
        weight: 70,
        _id: undefined // Will be set by controller
        ,
        birthday: undefined,
        gender: 'Male'
      };

      const req = {
        user: {
          userId: 'testUserId'
        }
      };

      const expectedResult = {
        message: 'Profile created successfully',
        data: { ...createUserDto, _id: 'testUserId' }
      };

      mockUserService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createUserDto, req);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.create).toHaveBeenCalledWith({
        ...createUserDto,
        _id: 'testUserId'
      });
    });
  });

  describe('findOne', () => {
    it('should get a user profile', async () => {
      const req = {
        user: {
          userId: 'testUserId'
        }
      };

      const expectedProfile = {
        _id: 'testUserId',
        name: 'John Doe',
        age: 25,
      };

      mockUserService.findOne.mockResolvedValue(expectedProfile);

      const result = await controller.findOne(req);

      expect(result).toEqual(expectedProfile);
      expect(mockUserService.findOne).toHaveBeenCalledWith('testUserId');
    });
  });

  describe('update', () => {
    it('should update a user profile', async () => {

      const id = mongoose.Types.ObjectId.createFromBase64("testUserId123456")
      const updateUserDto: UpdateUserDto = {
        name: 'John Updated',
        age: 26,
        birthday: undefined,
        gender: 'Male',
        height: 181,
        weight: 65,
        _id: id
      };

      const req = {
        user: {
          userId: id
        }
      };

      const expectedResult = {
        message: 'Profile updated successfully',
        data: { ...updateUserDto, _id: id }
      };

      mockUserService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(req, updateUserDto);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.update).toHaveBeenCalledWith(id, updateUserDto);
    });
  });

  describe('upsertInterest', () => {
    it('should upsert user interests', async () => {

      const id = mongoose.Types.ObjectId.createFromBase64("testUserId123456")
      const createUserInterestDto: CreateUserInterestDto = {
        _id: undefined, // Will be set by controller
        interest: ['reading', 'gaming'],
        userId: id
      };

      const req = {
        user: {
          userId: id
        }
      };

      const expectedResult = {
        message: 'Interests updated successfully',
        data: { ...createUserInterestDto, _id: 'testUserId' }
      };

      mockUserService.upsertInterest.mockResolvedValue(expectedResult);

      const result = await controller.upsertInterest(req, createUserInterestDto);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.upsertInterest).toHaveBeenCalledWith({
        ...createUserInterestDto,
        _id: id
      });
    });
  });

  // Error cases
  describe('error handling', () => {
    it('should handle errors when creating profile', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        age: 25,

        height: 175,
        weight: 70,
        _id: undefined,
        birthday: undefined,
        gender: 'Male'
      };

      const req = {
        user: {
          userId: 'testUserId'
        }
      };

      mockUserService.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(createUserDto, req)).rejects.toThrow('Database error');
    });

    it('should handle errors when getting profile', async () => {
      const req = {
        user: {
          userId: 'testUserId'
        }
      };

      mockUserService.findOne.mockRejectedValue(new Error('User not found'));

      await expect(controller.findOne(req)).rejects.toThrow('User not found');
    });
  });
});