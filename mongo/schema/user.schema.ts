import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Profile } from "./profile/profile.schema";
export type UserDocumentWithId = UserDocument & { _id: Types.ObjectId };
export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String })
  displayname?: string;
 
 
  @Prop({ type: String , default : null})
  avatar?: string;
  
  
  @Prop({ type: Boolean, default : false  })
  isOnline : boolean;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true , unique : true})
  username: string;

  @Prop({ type: String, required: true, index: true, unique: true })
  email: string;

  @Prop({type : String})
  password?: string;

  @Prop({ type: Boolean, default: false })
  verified: boolean;

  @Prop({ type: String})
  provider?: string;

  @Prop({ type: String })
  providerId?: string;

  @Prop({ type: String })
  refreshToken?: string;

  @Prop({ type: Types.ObjectId, ref: Profile.name })
  profile: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default : [] })
  friends: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Group' }], default : [] })
  groups: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserFeatureModel = {
  name : User.name , schema : UserSchema
}