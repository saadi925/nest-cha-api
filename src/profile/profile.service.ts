import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateProfileDto } from "./dto/create-profile.dto";
import {
  Profile,
  ProfileDocument,
} from "../../mongo/schema/profile/profile.schema";
import { UserService } from "src/user/user.service";
import {  MultipartFile } from "@fastify/multipart";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { readFile } from "fs/promises";
export const SERVER_URL = "http://localhost:5000";
@Injectable()
export class ProfileService {
  private basePath = join(__dirname, '..', '..', 'avatars');
  constructor(
    
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    private userService: UserService,
  ) {
      if (!existsSync(this.basePath)) {
        mkdirSync(this.basePath, { recursive: true });
    }
  
  }
  async uploadAvatar(userId: unknown, file: MultipartFile) {
    const fileBuffer = await file.toBuffer()
   

    const filePath = join(this.basePath, file.filename);
    const base64 = await this.getFileBase64(filePath)
   if (filePath) {
    writeFileSync(filePath, fileBuffer);
     await this.profileModel.findOneAndUpdate({userId}, {
      avatar : base64
    })
    return base64;
   
  }
    return null;
  }
  private async getFileBase64(filePath : string): Promise<string | null> {
    try {
      const fileContent = await readFile(filePath);
      const base64Data = fileContent.toString('base64');
      return base64Data;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null; // File not found
      } else {
        throw error;
      }
    }
  }
  async createProfile(
    createProfileDto: CreateProfileDto,
    userId: Types.ObjectId,
  ): Promise<Profile> {
    const createdProfile = new this.profileModel({
      ...createProfileDto,
      userId: userId,
    });
    return createdProfile.save();
  }

  async findProfileByUsername(username: string, currentUser: Types.ObjectId) {
    const user = await this.userService.findUserByUsername(username);

    let profile = await this.profileModel.findOne({ userId: user._id }).exec();
  

    return {
      ...profile.toJSON(),
      username: username,
    };
  }
  async getUserProfile(userId: string) {
    return await this.profileModel.findOne({ userId }).exec();
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

  async findProfileByUserId(userId: string): Promise<Profile> {
    return this.profileModel.findOne({ user: userId }).exec();
  }

  // async getUserProfiles(
  //   page: number,
  //   pageSize: number,
  //   userId: Types.ObjectId,
  // ) {
  //   const skip = (page - 1) * pageSize;

  //   const profiles = await this.profileModel.aggregate([
  //     {
  //       $match: {
  //         userId: { $ne: userId },
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "userId",
  //         foreignField: "_id",
  //         as: "userDetails",
  //       },
  //     },
  //     {
  //       $unwind: "$userDetails",
  //     },
  //     {
  //       $project: {
  //         displayName: 1,
  //         bio: 1,
  //         avatar: 1,
  //         isOnline: 1,
  //         organization: 1,
  //         profileDescription: 1,
  //         username: "$userDetails.username",
  //         name: "$userDetails.name",
  //       },
  //     },
  //     { $skip: skip },
  //     { $limit: pageSize },
  //   ]);

  //   const totalProfiles = await this.profileModel.countDocuments({
  //     userId: { $ne: userId },
  //   });
  //   const totalPages = Math.ceil(totalProfiles / pageSize);

  //   return {
  //     profiles,
  //     currentPage: page,
  //     totalPages,
  //     totalProfiles,
  //   };
  // }
  
}
