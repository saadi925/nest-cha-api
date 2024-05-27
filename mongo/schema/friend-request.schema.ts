import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "./user.schema";
export enum $FriendRequestStatus {
 REJECTED = 'rejected',
    ACCEPTED = 'accepted',
    PENDING = 'pending'
}
export type FriendRequestDocument = FriendRequest & Document;

@Schema({ timestamps: true })
export class FriendRequest extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  receiverId: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: Object.values($FriendRequestStatus),
    default: $FriendRequestStatus.PENDING
  })
    status: $FriendRequestStatus;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);

export const FriendRequestFeatureModel =  {
  name: FriendRequest.name,
  schema: FriendRequestSchema,
}