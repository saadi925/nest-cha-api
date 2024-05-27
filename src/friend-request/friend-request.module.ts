import { Module } from "@nestjs/common";
import { FriendRequestService } from "./friend-request.service";
import { FriendRequestController } from "./friend-request.controller";
import { UserModule } from "src/user/user.module";
import { MongooseModule } from "@nestjs/mongoose";
import { FriendRequestFeatureModel } from "mongo/schema/friend-request.schema";
import { ConversationModule } from "src/conversation/conversation.module";

@Module({
  imports: [
    UserModule,
    ConversationModule,
    MongooseModule.forFeature([FriendRequestFeatureModel]),
  ],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
})
export class FriendRequestModule {}
