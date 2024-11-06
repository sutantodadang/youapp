import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { userProviders } from './user.provider';
import { MessageModule } from '../message/message.module';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from '../../database/database.provider';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('UserService', () => {
  let service: UserService;
  let module: TestingModule;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    // Create an in-memory MongoDB instance
    mongod = await MongoMemoryServer.create();
    process.env.DB_URI = mongod.getUri();
  });

  afterAll(async () => {
    // Cleanup
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    await mongod.stop();
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MessageModule,
      ],
      providers: [
        UserService,
        ...userProviders,
        ...databaseProviders,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    // Clean up after each test if needed
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});