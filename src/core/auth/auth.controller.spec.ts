import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { userProviders } from '../user/user.provider';
import { DatabaseModule } from '../../database/database.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('AuthController', () => {
  let controller: AuthController;
  let module: TestingModule;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    // Create in-memory MongoDB instance
    mongod = await MongoMemoryServer.create();
    process.env.DB_URI = mongod.getUri();
    // Set JWT secret for testing
    process.env.JWT_SECRET = 'test-secret';
  });

  afterAll(async () => {
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
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
        DatabaseModule,
        UserModule,
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtStrategy,
        ...userProviders,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});