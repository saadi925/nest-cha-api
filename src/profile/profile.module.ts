import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Profile, ProfileSchema } from "mongo/schema/profile/profile.schema";
import { UserModule } from "src/user/user.module";
import { ConversationModule } from "src/conversation/conversation.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
    ]),
    UserModule,
    ConversationModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
