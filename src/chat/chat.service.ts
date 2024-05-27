import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation, ConversationDocument } from 'mongo/schema/conversation.schema';
import { Message, MessageDocument } from 'mongo/schema/message.schema';
import { Model, Types } from 'mongoose';
import { CreateMessageDto } from './chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const createdMessage = new this.messageModel(createMessageDto);
    await createdMessage.save();
    await this.conversationModel.findByIdAndUpdate(createMessageDto.conversationId, {
      $push: { messages: createdMessage._id },
      lastMessageAt: new Date(),
    });
    return createdMessage;
  }
 async fetchMessages(conversationId: Types.ObjectId): Promise<Message[]> {
    return await this.messageModel.find({ conversationId }).sort('desc').exec();
  }
}
