import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateConversationDto {
  participants: Types.ObjectId[];
  title?: string;
}

export class UserDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}