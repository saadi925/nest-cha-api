import { Module } from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { ConversationController } from "./conversation.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ConversationFeatureModel } from "mongo/schema/conversation.schema";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [MongooseModule.forFeature([ConversationFeatureModel]), UserModule],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
