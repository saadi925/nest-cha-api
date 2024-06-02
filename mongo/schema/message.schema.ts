import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "./user.schema";
import { Conversation } from "./conversation.schema";

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Conversation.name, required: true })
  conversationId: Types.ObjectId;

  @Prop({ type: String })
  mediaType?: string;

  @Prop({ type: String })
  mediaUrl?: string;
  @Prop({ type: String, default : false })
  seen: boolean;
  @Prop({ type: String })
  thumbnailUrl?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

export const MessageFeatureModel = {
  name : Message.name , schema : MessageSchema
}