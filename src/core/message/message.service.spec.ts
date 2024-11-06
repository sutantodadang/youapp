import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ViewMessageDto } from './dto/view-message.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Message } from './entities/message.entity';

describe('MessageService', () => {
  let service: MessageService;
  let jwtService: JwtService;
  let mongod: MongoMemoryServer;
  let module: TestingModule;

  const id1 = mongoose.Types.ObjectId.createFromBase64("testUserId123456")
  const id2 = mongoose.Types.ObjectId.createFromBase64("testUserId789123")

  // Mock message model
  const mockMessageModel = {
    create: jest.fn().mockReturnValue({
      save: jest.fn().mockResolvedValue({
        sender: id1,
        receiver: id2,
        content: 'Hello, World!',
      }),
    }),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([
        {
          sender: id1,
          receiver: id2,
          content: 'Hello, World!',
        },
      ]),
    }),
  };

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    process.env.DB_URI = mongoUri;
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
        MessageService,
        {
          provide: 'MESSAGE_MODEL', // Matches exactly with @Inject("MESSAGE_MODEL")
          useValue: mockMessageModel,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mockToken'),
          },
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
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

  it('should create a new message', async () => {


    const createMessageDto: CreateMessageDto = {
      sender: id1,
      receiver: id2,
      content: 'Hello, World!',
    };

    const result = await service.create(createMessageDto);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('sender', createMessageDto.sender);
    expect(result).toHaveProperty('receiver', createMessageDto.receiver);
    expect(result).toHaveProperty('content', createMessageDto.content);
    expect(mockMessageModel.create).toHaveBeenCalledWith(createMessageDto);
  });

  it('should find all messages between sender and receiver', async () => {

    const viewMessageDto: ViewMessageDto = { sender: id1, receiver: id2 };

    const result = await service.findAll(viewMessageDto);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('sender', viewMessageDto.sender);
    expect(result[0]).toHaveProperty('receiver', viewMessageDto.receiver);
    expect(mockMessageModel.find).toHaveBeenCalledWith({
      sender: viewMessageDto.sender,
      receiver: viewMessageDto.receiver,
    });
  });
});
