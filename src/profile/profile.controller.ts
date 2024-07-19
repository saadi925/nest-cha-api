import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { FastifyReply } from "fastify";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { Profile } from "mongo/schema/profile/profile.schema";
import { JwtAuthGuard } from "src/jwt/jwt.guard";
import { RequestWithUser } from "request";
import { Types } from "mongoose";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createProfileDto: CreateProfileDto,
    @Req() req: RequestWithUser,
  ): Promise<Profile> {
    const userId = req.user._id as any;

    return await this.profileService.createProfile(createProfileDto, userId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get("all")
  async getAllProfiles(
    @Query("page", new ParseIntPipe({ optional: true })) page = 1,
    @Query("pageSize", new ParseIntPipe({ optional: true })) pageSize = 1,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user._id as Types.ObjectId;
console.log("getting profiles");

    // return await this.profileService.getUserProfiles(page, pageSize, userId);
  }
  
  @Post('avatar') 
  @UseGuards(JwtAuthGuard)
  async updateAvatar(@Req() req: RequestWithUser,reply: FastifyReply) {
    const { _id : userId} = req.user
    if (!req.isMultipart()) {
      throw new HttpException('Unsupported Media Type', HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }
    const file = await req.file()
    const filePath = await this.profileService.uploadAvatar(userId,  file)
    
    reply.send({ url : filePath })
    
    
    
  }
  @Get("/inbox/:username")
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param("username") username: string,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user._id as Types.ObjectId;

    return await this.profileService.findProfileByUsername(username, user);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async findUserProfile(@Req() req: RequestWithUser): Promise<Profile> {
    const userId = req.user?._id as string;

    return await this.profileService.getUserProfile(userId);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id") id: string,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    return await this.profileService.updateProfile(id, createProfileDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async remove(@Param("id") id: string): Promise<Profile> {
    return await this.profileService.deleteProfile(id);
  }



  
}
