import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { RequestWithUser } from "request";
import { JwtAuthGuard } from "src/jwt/jwt.guard";
import { Types } from "mongoose";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @UseGuards(JwtAuthGuard)
  @Get("fetchMessages/:conversationId")
  async fetchMessages(
    @Param("conversationId") conversationId: string,
    @Req() req: RequestWithUser,
  ) {
    console.log("fetching chat messages");

    const response = await this.chatService.fetchMessages(
      conversationId,
      req.user._id as Types.ObjectId,
    );
    // console.log("fetched this : ", response);

    return response;
  }
}
