import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { EmailService } from "./email-send.service";
import { JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { UserFeatureModel } from "mongo/schema/user.schema";
import {
  EmailVerification,
  EmailVerificationSchema,
} from "mongo/schema/email-verification/email-verify.schema";
import { EmailVerificationService } from "./email-verification.service";
// import { GoogleStrategy } from "src/google-auth/google-auth.strategy";
import { PassportModule } from "@nestjs/passport";
import { TokenService } from "./token.service";
import { JwtStrategy } from ".";

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([
      UserFeatureModel,
      { name: EmailVerification.name, schema: EmailVerificationSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    EmailService,
    // ,GoogleStrategy,
    JwtService, 
    EmailVerificationService,
    TokenService,
    JwtStrategy
  ],
  exports: [AuthService, EmailVerificationService],
})
export class AuthModule {}
