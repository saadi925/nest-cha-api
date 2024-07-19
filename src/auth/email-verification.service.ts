import { Inject, Injectable } from "@nestjs/common";
import {
  EmailVerification,
  EmailVerificationDocument,
} from "mongo/schema/email-verification/email-verify.schema";
import { User, UserDocument } from "mongo/schema/user.schema";
import { Model, Types } from "mongoose";
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
    email: string,
  ): Promise<string> {
    await this.emailVerifyModel.create({
      user: userId,
      code: verificationCode,
      email: email,
    });

    return verificationCode;
  }

  async verifyEmail(
    email: string,
    verificationCode: string,
  ): Promise<{
    success: boolean;
    user?  : User
  }> {
    const emailVerification = await this.emailVerifyModel
      .findOne({
        email,
        code: verificationCode,
      })
      .exec();
    if (!emailVerification) {
      return {
        success: false,
      };
    }
    await this.userModel.updateOne(
      { _id: emailVerification.user },
      { verified: true },
    );
    await this.emailVerifyModel.deleteOne({
      email,
      code: verificationCode,
    });
    const user = await this.userModel.findById(emailVerification.user).exec();
    return {
      success: true,
       user
    };
  }
}
