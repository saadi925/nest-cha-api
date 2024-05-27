import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConversationFeatureModel } from "mongo/schema/conversation.schema";
import { MessageFeatureModel } from "mongo/schema/message.schema";

@Module({
  imports: [
    MongooseModule.forFeature([ConversationFeatureModel, MessageFeatureModel]),
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
