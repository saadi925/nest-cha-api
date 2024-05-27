import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Types } from 'mongoose';
import { WsJwtAuthGuard } from './ws.guard';
import { CreateMessageDto } from './chat.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const message = await this.chatService.createMessage(createMessageDto);
    this.server.to(createMessageDto.conversationId.toString()).emit('newMessage', message);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('fetchMessages')
  async handleFetchMessages(
    @MessageBody('conversationId') conversationId: Types.ObjectId,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const messages = await this.chatService.fetchMessages(conversationId);
    client.emit('messages', messages);
  }
  
}
