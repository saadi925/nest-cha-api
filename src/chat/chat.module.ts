import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConversationFeatureModel } from "../../mongo/schema/conversation.schema";
import { MessageFeatureModel } from "../../mongo/schema/message.schema";
import { JwtService } from "@nestjs/jwt";
import { UserFeatureModel } from "mongo/schema/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      ConversationFeatureModel,
      MessageFeatureModel,
      UserFeatureModel,
    ]),
  ],
  providers: [ChatGateway, ChatService, JwtService],
})
export class ChatModule {}
