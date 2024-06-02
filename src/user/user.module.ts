import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserFeatureModel } from "mongo/schema/user.schema";

@Module({
  imports: [MongooseModule.forFeature([UserFeatureModel])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
