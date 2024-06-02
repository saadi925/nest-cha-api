import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService, EmailService, JwtStrategy } from "./auth";
import { ProfileModule } from "./profile/profile.module";
import { User, UserFeatureModel, UserSchema } from "mongo/schema/user.schema";
import { ConfigModule } from "@nestjs/config";
import { FriendRequestModule } from "./friend-request/friend-request.module";
import { ChatGateway } from "./chat/chat.gateway";
import { ConversationModule } from "./conversation/conversation.module";
import { ChatModule } from "./chat/chat.module";
import { FileUploadsModule } from './file-uploads/file-uploads.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

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
    PassportModule,
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
  providers: [AppService, JwtStrategy, AuthService, EmailService, JwtStrategy],
  exports: [JwtStrategy, JwtModule],
})
export class AppModule {}
