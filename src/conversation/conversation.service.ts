import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation, ConversationDocument } from 'mongo/schema/conversation.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ConversationService {
constructor(
  @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>

){}
  async create(createConversationDto: CreateConversationDto) {
  return await this.conversationModel.create(createConversationDto)
  }
  async getConversationsByUserId(userId: Types.ObjectId): Promise<Conversation[]> {
    return await this.conversationModel.find({ participants: userId }).exec();
  }
}
