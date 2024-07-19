import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "./user.schema";

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ type: [Types.ObjectId], ref: User.name, required: true })
  participants: Types.ObjectId[];

  @Prop({ type: String })
  title?: string;

  @Prop({ type: Date, default: Date.now })
  lastMessageAt: Date;

  @Prop({ type: [Types.ObjectId], ref: 'Message', default : [] })
  messages: Types.ObjectId[];

  @Prop({type : String})
  lastMessage : string
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

export const ConversationFeatureModel = {name : Conversation.name , schema : ConversationSchema}