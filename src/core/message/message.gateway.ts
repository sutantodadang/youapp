import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from "socket.io";

@WebSocketGateway(5050, {
  cors: {
    origin: '*',
  },
})
export class MessageGateway {
  constructor() { }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  sendMessage(@MessageBody() data: string): string {

    console.log(data)


    this.server.emit("message", data)

    return data;
  }


}
