import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { RequestWithUser } from "request";
import { Types } from "mongoose";
import { JwtAuthGuard } from "src/jwt/jwt.guard";

@Controller("conversations")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createConversationDto: CreateConversationDto) {
    return await this.conversationService.create(createConversationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserConversations(@Req() req: RequestWithUser) {
    const userId = req.user._id as Types.ObjectId;
    return await this.conversationService.getConversationsByUserId(userId);
  }
}
