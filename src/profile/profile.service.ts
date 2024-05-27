import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateProfileDto } from "./dto/create-profile.dto";
import {
  Profile,
  ProfileDocument,
} from "../../mongo/schema/profile/profile.schema";
import { UserService } from "src/user/user.service";

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    private userService: UserService,
  ) {}

  async createProfile(
    createProfileDto: CreateProfileDto,
    userId: string,
  ): Promise<Profile> {
    const createdProfile = new this.profileModel({
      ...createProfileDto,
      user: userId,
    });
    return createdProfile.save();
  }

  async findProfileByUsername(username: string): Promise<Profile> {
    const userId = await this.userService.findUserIdByUsername(username);
    return this.profileModel.findOne({ userId }).exec();
  }

  async updateProfile(
    id: string,
    createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    return this.profileModel
      .findByIdAndUpdate(id, createProfileDto, { new: true })
      .exec();
  }

  async deleteProfile(id: string): Promise<Profile> {
    return this.profileModel.findByIdAndDelete(id).exec();
  }

  async toggleOnline(userId: string): Promise<boolean> {
    const profile = await this.profileModel.findOne({ user: userId }).exec();
    profile.isOnline = !profile.isOnline;
    const newp = await profile.save();
    return newp.isOnline || false;
  }
}
