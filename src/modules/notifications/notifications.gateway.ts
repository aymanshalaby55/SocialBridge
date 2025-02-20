import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3000)
export class NotificationsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
    });
  }

  @SubscribeMessage('new_post')
  handleNewPost(client: any, payload: any, @MessageBody() body): string {
    this.server.emit('Message', {
      msg: 'new message',
      content: payload,
    });
    return 'hi';
  }
}
