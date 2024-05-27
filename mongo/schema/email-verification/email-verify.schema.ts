import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from "../user.schema";

export type EmailVerificationDocument = EmailVerification & Document;

@Schema({ timestamps: true })
export class EmailVerification extends Document {
  @Prop({ type: String, required: true, unique : true })
  email: string;

  @Prop({ type: SchemaTypes.ObjectId, ref : User.name })
  user : Types.ObjectId;
  @Prop({ type: String, required: true })
  code: string;
  
}

export const EmailVerificationSchema = SchemaFactory.createForClass(EmailVerification);
