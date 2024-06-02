import { Types } from "mongoose";

export class CreateConversationDto {
  participants: Types.ObjectId[];
  title?: string;
}
