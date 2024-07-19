import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { ProfileModule } from "./profile/profile.module";
import { UserFeatureModel} from "mongo/schema/user.schema";
import { ConfigModule } from "@nestjs/config";
import { FriendRequestModule } from "./friend-request/friend-request.module";
import { ConversationModule } from "./conversation/conversation.module";
import { ChatModule } from "./chat/chat.module";
import { FileUploadsModule } from './file-uploads/file-uploads.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { LoggerMiddleware } from "./nest.exception";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'avatars'),
      
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([UserFeatureModel]),
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
    }),
    ProfileModule,
    FriendRequestModule,
    ConversationModule,
    ChatModule,
    FileUploadsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes("*");
  }
}
