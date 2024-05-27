import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UserService } from "src/user/user.service";
import { CreateFriendRequestDto } from "./dto/create-friend-request.dto";
import {
  $FriendRequestStatus,
  FriendRequest,
  FriendRequestDocument,
} from "mongo/schema/friend-request.schema";
import { ConversationService } from "src/conversation/conversation.service";

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectModel(FriendRequest.name)
    private friendRequestModel: Model<FriendRequestDocument>,
    private userService: UserService,
    private conversationService : ConversationService
  ) {}

  async create(
    createFriendRequestDto: CreateFriendRequestDto,
    userId: string,
  ): Promise<FriendRequest> {
    const { username } = createFriendRequestDto;

    const targetUserId = await this.userService.findUserIdByUsername(username);
    if (!targetUserId) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    // Check if a friend request already exists
    const existingRequest = await this.friendRequestModel.findOne({
      senderId: userId,
      receiverId: targetUserId,
    });
    if (existingRequest) {
      throw new ConflictException(`Friend request already exists`);
    }

    const friendRequest = new this.friendRequestModel({
      senderId: userId,
      receiverId: targetUserId,
    });

    return friendRequest.save();
  }

  async getAllReceivedRequests(userId: string): Promise<FriendRequest[]> {
    return this.friendRequestModel
      .find({ senderId: userId })
      .populate("recieverId")
      .exec();
  }

  async getAllSentRequests(userId: string): Promise<FriendRequest[]> {
    return this.friendRequestModel
      .find({ senderId: userId })
      .populate("recieverId")
      .exec();
  }

  async cancelRequest(username: string, userId: string): Promise<void> {
    const targetUserId = await this.userService.findUserIdByUsername(username);
    if (!targetUserId) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    await this.friendRequestModel
      .deleteOne({ senderId: userId, receiverId: targetUserId })
      .exec();
  }
  async acceptFriendRequest(username : string , userId : Types.ObjectId){
    const targetUserId = await this.userService.findUserIdByUsername(username);
    if (!targetUserId) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    const filterQuery = {senderId : userId, receiverId : targetUserId}
    const request = await this.friendRequestModel.findOneAndUpdate(filterQuery, {
      status :$FriendRequestStatus.ACCEPTED
    })
     await this.conversationService.create({ participants :[userId, targetUserId]})    

    return request
  }

}
