import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from "@nestjs/websockets";
import { ChatService } from "./chat.service";
import { Model, Types } from "mongoose";
import { SocketWithUser } from "./ws.guard";
import { CreateMessageDto } from "./chat.dto";
import { JwtService } from "@nestjs/jwt";
import { Server } from "http";
import { User, UserDocument } from "mongo/schema/user.schema";
import { InjectModel } from "@nestjs/mongoose";

@WebSocketGateway(8080, {
  // transports: ['websocket'],
  cors: {
    origin: "*",
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: SocketWithUser;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  afterInit(server: Server) {
    console.log("WebSocket server initialized");
  }

  async handleConnection(client: SocketWithUser, ...args: any[]) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) {
        throw new WsException("Unauthorized");
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.userModel
        .findById(payload.userId)
        .select("-password");
      if (!user) {
        throw new WsException("Unauthorized");
      }
      client.user = user;
      // Join all conversation rooms the user is part of
      const conversations = await this.chatService.getUserConversations(
        user._id as Types.ObjectId,
      );
      conversations.forEach((conversation) => {
        client.join(conversation._id.toString());
      });

      console.log(
        `Client connected: ${client.id}, user: ${client.user.username}`,
      );
    } catch (error) {
      console.log(`Client connection failed: ${error.message}`);
      client.disconnect();
    }
  }
  handleDisconnect(client) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("sendMessage")
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: SocketWithUser,
  ): Promise<void> {
    createMessageDto.senderId = client.user._id as Types.ObjectId;
    const message = await this.chatService.createMessage(createMessageDto);
    const emittedMessage = {
      ...message.toJSON(),
      own: message.senderId.equals(client.user._id as Types.ObjectId),
    };

    // Emit the message to all clients in the room except the sender
    client.broadcast
      .to(createMessageDto.conversationId.toString())
      .emit("newMessage", {
        ...emittedMessage,
        own: false, // For all other clients, own should be false
      });
     console.log("message sent", emittedMessage);
     
    // Emit the message to the sender
    client.emit("newMessage", emittedMessage);
  }
}
