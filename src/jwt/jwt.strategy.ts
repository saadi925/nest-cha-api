import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { User, UserDocument } from "mongo/schema/user.schema";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";

interface JwtPayload {
  userId: string;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly user: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const { userId } = payload;

    const user = await this.user.findById(userId).select("-password");
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    const now = Date.now() / 1000;
    if (payload.exp && payload.exp < now) {
      throw new UnauthorizedException("Token expired");
    }

    return user;
  }
}
