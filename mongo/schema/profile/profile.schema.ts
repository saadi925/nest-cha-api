import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "../user.schema";

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile extends Document {
  @Prop({ type: String })
  displayName?: string;

  @Prop({ type: String })
  bio?: string;

  @Prop({ type: String })
  avatar?: string;
  
  
  @Prop({ type: Boolean, default : false  })
  isOnline : boolean;
  
  
  @Prop({ type: String })
  organization?: string;

  @Prop({ type: String })
  profileDescription?: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
