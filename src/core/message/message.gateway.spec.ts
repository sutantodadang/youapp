import { Test, TestingModule } from '@nestjs/testing';
import { MessageGateway } from './message.gateway';
import { Server } from 'socket.io';
import * as io from 'socket.io-client';

describe('MessageGateway', () => {
  let gateway: MessageGateway;
  let clientSocket: io.Socket;
  const SOCKET_PORT = 5050;
  const testMessage = 'Hello, WebSocket!';


  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageGateway],
    }).compile();

    gateway = module.get<MessageGateway>(MessageGateway);

    // Initialize the WebSocket server manually
    gateway.server = new Server(SOCKET_PORT, {
      cors: { origin: '*' },
    });
    gateway.server.on('connection', (socket) => {
      console.log('Server connected to client');
    });
  }, 30000); // Increased timeout for setup

  afterAll((done) => {
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }
    gateway.server.close(() => {
      console.log('Server closed');
      done();
    });
  });

  beforeEach((done) => {
    clientSocket = io.connect(`http://localhost:${SOCKET_PORT}`, {
      transports: ['websocket'],
    });

    clientSocket.on('connect', () => {
      console.log('Client connected');
      clientSocket.emit('message', "hello world");

      done();
    });
  });

  afterEach((done) => {
    if (clientSocket.connected) {
      clientSocket.on('message', (data) => {
        console.log('Message received on client:', data);
        expect(data).toBe(testMessage);
        done();
      });
      clientSocket.disconnect();
      done()
    }
  });

  it('should receive and emit messages', (done) => {


    // Ensure client is listening to "message" event
    clientSocket.on('message', (data) => {
      console.log('Message received on client:', data);
      expect(data).toBe(testMessage);
      done();
    });

    // Emit message from client to server
    clientSocket.emit('message', testMessage);
    done()

  }, 10000); // Increased timeout for the test
});
