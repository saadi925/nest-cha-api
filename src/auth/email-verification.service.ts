import { Inject, Injectable } from "@nestjs/common";
import {
  EmailVerification,
  EmailVerificationDocument,
} from "mongo/schema/email-verification/email-verify.schema";
import { User, UserDocument } from "mongo/schema/user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectModel(EmailVerification.name)
    private emailVerifyModel: Model<EmailVerificationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async generateVerificationCode(
    userId: string,
    verificationCode: string,
  ): Promise<string> {
    await this.emailVerifyModel.create({
      user: userId,
      code: verificationCode,
    });

    return verificationCode;
  }

  async verifyEmail(email: string, verificationCode: string): Promise<boolean> {
    const emailVerification = await this.emailVerifyModel.findOne({
      email,
      code: verificationCode,
    });

    if (!emailVerification) {
      return false;
    }

    await this.userModel.updateOne(
      { _id: emailVerification.user },
      { verified: true },
    );

    await this.emailVerifyModel.deleteOne({
      email,
      code: verificationCode,
    });

    return true;
  }
}
