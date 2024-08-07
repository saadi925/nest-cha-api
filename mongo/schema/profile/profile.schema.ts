import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "../user.schema";

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile extends Document {


  @Prop({ type: String })
  bio?: string;

  
  
  @Prop({ type: String })
  organization?: string;

  @Prop({ type: String })
  about?: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
