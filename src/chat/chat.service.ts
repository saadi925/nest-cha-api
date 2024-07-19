import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  Conversation,
  ConversationDocument,
} from "../../mongo/schema/conversation.schema";
import { Message, MessageDocument } from "../../mongo/schema/message.schema";
import { Model, Types } from "mongoose";
import { CreateMessageDto } from "./chat.dto";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const createdMessage = new this.messageModel(createMessageDto);
    await createdMessage.save();
    await this.conversationModel.findByIdAndUpdate(
      createMessageDto.conversationId,

      {
        $push: { messages: createdMessage._id },
        lastMessageAt: new Date(),
        lastMessage: createdMessage.content.slice(0, 20)
      },
    );
    return createdMessage;
  }
 
  async createConversation(
    userId: Types.ObjectId,
    recieverId: string,
  ): Promise<Conversation> {
    const conversation = new this.conversationModel({
      participants: [userId, recieverId],
      lastMessageAt: new Date(),
    });
    return await conversation.save();
  }

  async getUserConversations(userId: Types.ObjectId): Promise<Conversation[]> {
    return this.conversationModel.find({ participants: userId }).exec();
  }
}
