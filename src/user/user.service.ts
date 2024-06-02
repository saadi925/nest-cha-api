import { Injectable, NotFoundException } from "@nestjs/common";
import { User, UserDocument } from "mongo/schema/user.schema";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { randomBytes } from "crypto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async createUser(data: { email: string; password: string; name: string }) {
    const user = await this.userModel.create({
      name: data.name,
      username: this.createUniqueUsername(data.name),
      password: data.password,
      verified: false,
    });
    return user;
  }
  async findUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }
  private createUniqueUsername(name: string): string {
    const baseUsername = name.startsWith("@") ? name : `@${name}`;
    const uniqueId = randomBytes(4).toString("hex");
    return `${baseUsername}-${uniqueId}`;
  }
  async findUserIdByUsername(username: string): Promise<Types.ObjectId> {
    const user = await this.userModel.findOne({ username }).select("id").lean();
    if (!user) {
      throw new NotFoundException(
        `User with the username ${username} not found`,
      );
    }
    return user._id as Types.ObjectId;
  }
  async findUserByUsername(username: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ username })
      .select("-password -email -groups -friends");
    if (!user) {
      throw new NotFoundException(
        `User with the username ${username} not found`,
      );
    }
    return user;
  }

  async setVerified(userId: Types.ObjectId) {
    await this.userModel.updateOne({ _id: userId }, { verified: true });
  }
}
