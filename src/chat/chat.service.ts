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
      },
    );
    return createdMessage;
  }
  async fetchMessages(conversationId: string, userId: Types.ObjectId) {
    const messages = await this.messageModel
      .find({ conversationId })
      .sort({ createdAt: "asc" })
      .exec();

    if (messages.length > 0) {
      const modifiedMessages = messages.map((message) => {
        const own = message.senderId.equals(userId);
        return { ...message.toJSON(), own };
      });

      // Update seen status for messages sent by the user in a bulk operation
      await this.messageModel.updateMany(
        { conversationId, senderId: userId, seen: false },
        { $set: { seen: true } },
      );

      return modifiedMessages;
    }

    return [];
  }

  async createConversation(
    userId: Types.ObjectId,
    username: string,
  ): Promise<Conversation> {
    const conversation = new this.conversationModel({
      participants: [userId, username],
      lastMessageAt: new Date(),
    });
    return await conversation.save();
  }
  async findOrCreateConversation(
    userId: Types.ObjectId,
    username: string,
  ): Promise<Conversation> {
    const conversation = await this.conversationModel.findOne({
      participants: [userId, username],
    });
    if (conversation) {
      return conversation;
    }
    return await this.createConversation(userId, username);
  }
  async getUserConversations(userId: Types.ObjectId): Promise<Conversation[]> {
    return this.conversationModel.find({ participants: userId }).exec();
  }
}
