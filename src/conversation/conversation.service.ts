import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Conversation, ConversationDocument } from "mongo/schema/conversation.schema";
import { Model, Types } from "mongoose";
import { UserService } from "src/user/user.service";

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    private readonly userService: UserService,
  ) {}
  async getConversations(userId: string, getConversationsDto: {
    page : number, pageSize : number
  }) {
    const { page = 1, pageSize : limit = 10 } = getConversationsDto;
    const skip = (page - 1) * limit;

    const query: any = { participants: userId };

    const conversations = await this.conversationModel
      .find(query)
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('participants', 'username displayname avatar isOnline')
      .exec();

    const totalConversations = await this.conversationModel.countDocuments(query);
    const totalPages = Math.ceil(totalConversations / limit);

    const formattedConversations = conversations.map(conversation => {
      const otherParticipant : any = conversation.participants.find(participant => participant._id.toString() !== userId);
      console.log(otherParticipant);
      

      return {
        name: conversation.title || otherParticipant.displayname,
        lastMessage: conversation.lastMessage,
        avatar: otherParticipant?.avatar || '', // Assuming a default avatar if none exists
        isOnline: otherParticipant?.isOnline || false, // Default, modify as needed
        lastMessageAt: conversation.lastMessageAt,
        username: otherParticipant?.username || '', // Modify according to your needs
        id: conversation._id,
      };
    });

    return {
      currentPage: page,
      totalPages,
      conversations: formattedConversations,
    };
  }
  async create(createConversationDto: CreateConversationDto) {
    return await this.conversationModel.create(createConversationDto);
  }
  

  async findOrCreateConversation(currentUser: Types.ObjectId, username: string) {
    const user = await this.userService.findUserIdByUsername(username);
    
    const conversation = await this.conversationModel
      .findOne({
        participants: { $all: [currentUser, user] },
      }).select('_id').lean()
      .exec();
    if (!conversation) {
     const created = await this.create({ participants: [currentUser, user] })
    
     return  {
      conversationId : created._id.toString()
    } ;     
    }
    console.log(conversation);
   
    
    return {
      conversationId : conversation._id.toString()
    };
  }


  async getConversationById(
    userId: Types.ObjectId,
    conversationId: string,
    limit: number,
    cursor?: Date,
    direction: 'before' | 'after' = 'before',
  ) {
    const conversation = await this.conversationModel.findOne({
      _id: conversationId,
      participants: { $in: [userId] },
    })
      .populate({
        path: 'participants',
        select: 'username displayname avatar isOnline',
      })
      .populate({
        path: 'messages',
        match: cursor ? (direction === 'before' ? { createdAt: { $lt: cursor } } : { createdAt: { $gt: cursor } }) : {},
        options: { sort: { createdAt: direction === 'before' ? -1 : 1 } 
        // , limit
      }
      })
      .exec();

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const messagesWithOwn = conversation.messages.map((message: any) => ({
      ...message.toJSON(),
      own: message.senderId.toString() === userId.toString(),
    }));

    const participants = conversation.participants
      .filter((participant: any) => participant._id.toString() !== userId.toString())
      .map((participant: any) => ({
        username: participant.username,
        displayname: participant.displayname,
        avatar: participant.avatar || null,
        isOnline: participant.isOnline,
      }));

    return {
      conversation: {
        ...conversation.toObject(),
        messages: direction === 'before' ? messagesWithOwn.reverse() : messagesWithOwn,
        participants,
      },
      pagination: {
        cursor: messagesWithOwn.length > 0 ? messagesWithOwn[messagesWithOwn.length - 1].createdAt : null,
      },
    }}
  



}
