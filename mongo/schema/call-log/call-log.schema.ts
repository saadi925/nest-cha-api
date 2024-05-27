import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "../user.schema";

export type CallLogDocument = CallLog & Document;

@Schema({ timestamps: true })
export class CallLog extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  callerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  receiverId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  startTime: Date;

  @Prop({ type: Date })
  endTime?: Date;

  @Prop({ type: Boolean, default: false })
  missed: boolean;

  @Prop({ type : String, default : 'audio'})
    callType: 'audio' | 'video';
}

export const CallLogSchema = SchemaFactory.createForClass(CallLog);
