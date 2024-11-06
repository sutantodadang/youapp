import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { RegisterUserDTO } from './dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let mongod: MongoMemoryServer;
  let module: TestingModule;

  // Mock user model
  const mockUserModel = {
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        id: 'someId',
        email: 'test@test.com',
        password: 'hashedPassword',
        name: 'Test User',
        username: 'testuser'
      })
    }),
    create: jest.fn().mockReturnValue({
      save: jest.fn().mockResolvedValue({
        id: 'someId',
        email: 'test@test.com',
        username: 'testuser'
      })
    }),
  };

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    process.env.DB_URI = mongoUri;
    process.env.JWT_SECRET = 'testSecret';
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
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'),
            signOptions: { expiresIn: '1h' },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        AuthService,
        JwtStrategy,
        {
          provide: 'USER_MODEL', // Matches exactly with @Inject("USER_MODEL")
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mockToken'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login successfully', async () => {
    const loginDto: LoginUserDTO = {
      email: "test@test.com",
      password: "password",
    };

    // Mock bcrypt.compare
    jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true);

    const result = await service.login(loginDto);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('token');
    expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
  });

  it('should register successfully', async () => {
    const registerDto: RegisterUserDTO = {
      email: "test@test.com",
      username: "testuser",
      password: "password",
      confirm_password: "password"
    };

    // Mock bcrypt.hash
    jest.spyOn(require('bcrypt'), 'hash').mockResolvedValue('hashedPassword');

    const result = await service.register(registerDto);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', 'ok');
    expect(result).toHaveProperty('data');
  });
});