import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://nyarachun.github.io',
    ],
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly connectedUsers = new Map<number, Set<string>>();

  handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);

    if (!userId || Number.isNaN(userId)) {
      client.disconnect();
      return;
    }

    client.join(`user:${userId}`);

    const sockets = this.connectedUsers.get(userId) ?? new Set<string>();
    sockets.add(client.id);
    this.connectedUsers.set(userId, sockets);
  }

  handleDisconnect(client: Socket) {
    const userId = Number(client.handshake.query.userId);

    if (!userId || Number.isNaN(userId)) {
      return;
    }

    const sockets = this.connectedUsers.get(userId);

    if (!sockets) {
      return;
    }

    sockets.delete(client.id);

    if (sockets.size === 0) {
      this.connectedUsers.delete(userId);
    }
  }

  @SubscribeMessage('joinChat')
  joinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: number },
  ) {
    if (!payload?.chatId) {
      return;
    }

    client.join(`chat:${payload.chatId}`);
  }

  @SubscribeMessage('leaveChat')
  leaveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: number },
  ) {
    if (!payload?.chatId) {
      return;
    }

    client.leave(`chat:${payload.chatId}`);
  }

  notifyChatMessage(chatId: number, message: unknown) {
    this.server.to(`chat:${chatId}`).emit('newMessage', message);
  }

  notifyUnreadCount(userId: number, unreadCount: number) {
    this.server.to(`user:${userId}`).emit('unreadCount', unreadCount);
  }
}
