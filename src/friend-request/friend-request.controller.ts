import { Controller, Get, Post, Body, Param, Put, Req } from "@nestjs/common";
import { FriendRequestService } from "./friend-request.service";
import { CreateFriendRequestDto } from "./dto/create-friend-request.dto";
import { RequestWithUser } from "request";

@Controller("friend-request")
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post()
  async create(
    @Body() createFriendRequestDto: CreateFriendRequestDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.friendRequestService.create(createFriendRequestDto, userId);
  }
  @Put("accept/:username")
  async acceptFriendRequest(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.friendRequestService.getAllSentRequests(userId);
  }
  @Get("received")
  async getAllReceivedRequests(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.friendRequestService.getAllReceivedRequests(userId);
  }

  @Get("sent")
  async getAllSentRequests(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.friendRequestService.getAllSentRequests(userId);
  }

  @Put("cancel/:username")
  async cancelRequest(
    @Param("username") username: string,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.friendRequestService.cancelRequest(username, userId);
  }
}
