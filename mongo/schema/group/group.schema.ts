import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "../user.schema";

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: User.name })
  members: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Message' })
  messages: Types.ObjectId[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
