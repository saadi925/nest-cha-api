import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseGuards,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { RequestWithUser } from "request";
import { Types } from "mongoose";
import { JwtAuthGuard } from "src/jwt/jwt.guard";

@Controller("conversations")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get(":conversationId")
  @UseGuards(JwtAuthGuard)
  async getMessagesByConversationId(
    @Param("conversationId") conversationId: string,
    @Req() req: RequestWithUser, 
    @Query('pageSize', new ParseIntPipe({optional : true})) pageSize: number = 10,
    @Query('cursor') cursor : string
  ) {
  const cursorAt = cursor ? new Date(cursor) : undefined;
    const userId = req.user._id as Types.ObjectId;
    console.log("cursorAt", cursorAt);
    
    return await this.conversationService.getConversationById(
      userId,
      conversationId,
      pageSize,
      cursorAt

    );
  }
  @Post(":username")
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: RequestWithUser,
    @Param("username") username: string
  ) : Promise<{conversationId : string}> {
    const userId = req.user._id as Types.ObjectId;

    return await this.conversationService.findOrCreateConversation(
      userId,
      username
    );
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getUserConversations(@Req() req: RequestWithUser, @Query('page', new ParseIntPipe({optional : true})) page : number = 1, @Query('pageSize', new ParseIntPipe({optional : true})) pageSize : number = 10) {
    const userId = req.user._id as Types.ObjectId;
    return await this.conversationService.getConversations(userId as any, {
    page, pageSize
    });
  }

}
