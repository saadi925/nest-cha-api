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
} from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { Profile } from "mongo/schema/profile/profile.schema";
import { JwtAuthGuard } from "src/jwt/jwt.guard";
import { RequestWithUser } from "request";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createProfileDto: CreateProfileDto,
    @Req() req: RequestWithUser,
  ): Promise<Profile> {
    const userId = req.user?._id as string;
    return this.profileService.createProfile(createProfileDto, userId);
  }
  @Get(":username")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("username") username: string): Promise<Profile> {
    return this.profileService.findProfileByUsername(username);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id") id: string,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    return this.profileService.updateProfile(id, createProfileDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async remove(@Param("id") id: string): Promise<Profile> {
    return this.profileService.deleteProfile(id);
  }
  @Put("toggleOnline")
  @UseGuards(JwtAuthGuard)
  async toggleOnline(@Req() req: RequestWithUser): Promise<boolean> {
    const userId = req.user?._id as string;
    return this.profileService.toggleOnline(userId);
  }
}
