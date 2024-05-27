import { IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateMessageDto {
    @IsString()
    content: string;
    
    senderId: Types.ObjectId;
  
    conversationId: Types.ObjectId;
    @IsOptional()
    @IsString()
    mediaType?: 'audio' | 'image' | 'video' | 'file';
    @IsOptional()
    @IsString()
    mediaUrl?: string;
    @IsOptional()
    @IsString()
    thumbnailUrl?: string; 
}