import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";
import { EmailVerificationService } from "./email-verification.service";
import { SignupDto } from "./dto/auth.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "mongo/schema/user.schema";
import { Model, Types } from "mongoose";
import { CredentialSignInResponse } from "src/types/Requests";

interface JwtPayload {
  userId: Types.ObjectId;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly jwtService: JwtService
  ) {}

  async signup(data: SignupDto): Promise<{ success: boolean; email: string }> {
    try {
      const user = await this.userModel.findOne({ email: data.email });

      if (user) {
        throw new UnauthorizedException("Email already exists");
      }

      const hashedPassword = await argon2.hash(data.password);

      const newUser = await this.userModel.create({
        email: data.email,
        password: hashedPassword,
        verified: false,
        name: data.name,
        displayname: data.name,
        username: await this.generateUsername(data.name),
      });
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      // await this.emailService.sendVerificationEmail(
      // data.email,
      // verificationCode,
      // );
      console.log("verificationCode : ", verificationCode);

      await this.emailVerificationService.generateVerificationCode(
        newUser.id,
        verificationCode,
        data.email
      );

      return { success: true, email: data.email };
    } catch (error) {
      throw error;
    }
  }
  private async generateUsername(name: string) {
    const baseUsername = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    let username = baseUsername;
    let count = 1;

    while (await this.userModel.exists({ username })) {
      username = `${baseUsername}-${count}`;
      count++;
    }

    return username;
  }
  async signin(
    email: string,
    password: string
  ): Promise<CredentialSignInResponse> {
    try {
      const user = await this.userModel.findOne({ email });
      if (user?.provider === "google") {
        throw new UnauthorizedException(
          "Google Sign In Required for this Account"
        );
      }
      if (!user || !(await argon2.verify(user.password, password))) {
        throw new UnauthorizedException("Invalid credentials");
      }

      if (!user.verified) {
        throw new UnauthorizedException("Verify your account first to log in");
      }
      const token = this.generateToken(user);
      return {
        tokens: {
          access_token: token,
          refresh_token: process.env.REFRESH_TOKEN_SECRET,
        },
        message: "Login successful",
        user: {
          displayname: user.displayname,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      throw error;
    }
  }
  async oAuthLogin(user) {
    if (!user) {
      throw new Error("User not found!!!");
    }
    const jwt = this.generateToken(user);
    return { jwt };
  }
  generateToken(user: User): string {
    const payload: JwtPayload = { userId: user._id as Types.ObjectId };
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }
  async handleEmailVerification(email: string, code: string) {
    const isVerified = await this.emailVerificationService.verifyEmail(
      email,
      code
    );
    if (!isVerified.success) {
      return {
        success: false,
        message: "invalid code",
      };
    }

    return {
      success: true,
      message: "Email Verified Successfully",
      token: this.generateToken(isVerified.user),
    };
  }

  async createUser(user: any) {
    const username = await this.generateUsername(user.name);
    const newUser = new this.userModel({
      ...user,
      username,
    });

    return await newUser.save();
  }
  async createGoogleAccount(googleData:GoogleCreateUser) : Promise<GoogleUser> {
   const user = await this.userModel.findOne({ email: googleData.email, providerId : googleData.providerId });
   if (user) {
     return {
       id: user.id,
       user: {
         displayname: user.displayname,
         email: user.email,
         avatar: user.avatar,
       },
       tokens: {
         accessToken: this.generateToken(user),
         refreshToken: process.env.REFRESH_TOKEN_SECRET,
       },
     };
   }
    const newUser = await this.createUser(googleData);
    return {
      id: newUser.id,
      user: {
        displayname: newUser.displayname,
        email: newUser.email,
        avatar: newUser.avatar,
      },
      tokens: {
        accessToken: this.generateToken(newUser),
        refreshToken: process.env.REFRESH_TOKEN_SECRET,
      },
    };
  }
}
export type GoogleCreateUser ={
  provider: string;
  providerId: string;
  email: string;
  name: string;
  avatar: string;
  refreshToken: string;
  verified: boolean;
}

type GoogleUser =  {
  id: string;
  user :{
    displayname: string;
    email: string;
    avatar: string;
  },
  tokens :{
    accessToken : string;
    refreshToken : string;
  }
}