import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from "@nestjs/common";
import * as argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "./email-send.service";
import { EmailVerificationService } from "./email-verification.service";
import { SignupDto } from "./dto/auth.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "mongo/schema/user.schema";
import { Model } from "mongoose";
import { randomBytes } from "crypto";

interface JwtPayload {
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly jwtService: JwtService,
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
        username: this.createUniqueUsername(data.name),
      });
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      await this.emailService.sendVerificationEmail(
        data.email,
        verificationCode,
      );
      await this.emailVerificationService.generateVerificationCode(
        newUser.id,
        verificationCode,
      );
      return { success: true, email: data.email };
    } catch (error) {
      throw error;
    }
  }
  private createUniqueUsername(name: string): string {
    const baseUsername = name.startsWith("@") ? name : `@${name}`;
    const uniqueId = randomBytes(4).toString("hex");
    return `${baseUsername}-${uniqueId}`;
  }
  async signin(
    email: string,
    password: string,
  ): Promise<{ token: string; message: string }> {
    try {
      const user = await this.userModel.findOne({ email });

      if (!user || !(await argon2.verify(user.password, password))) {
        throw new UnauthorizedException("Invalid credentials");
      }

      if (!user.verified) {
        throw new UnauthorizedException("Verify your account first to log in");
      }

      const token = await this.generateToken(user.id);
      // await this.saveToken(user.id, token, { days: 3 });

      return { token, message: "Login successful" };
    } catch (error) {
      throw error;
    }
  }

  private async generateToken(userId: string): Promise<string> {
    const payload: JwtPayload = { userId };
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }

  // private async blacklistTokens(userId: string): Promise<void> {
  //   await this.prisma.token.updateMany({
  //     where: { userId },
  //     data: { isBlackListed: true },
  //   });
  // }

  // async logout(userId: string): Promise<void> {
  //   await this.blacklistTokens(userId);
  // }

  // async isTokenBlacklisted(token: string): Promise<boolean> {
  //   const blacklistedToken = await this.prisma.token.findFirst({
  //     where: { token, isBlackListed: true },
  //   });
  //   return !!blacklistedToken;
  // }

  // private async saveToken(
  //   userId: string,
  //   token: string,
  //   expiresAt?: {
  //     days: number;
  //   },
  // ): Promise<void> {
  //   let DEFAULT_DAYS = 7;
  //   if (expiresAt.days) {
  //     DEFAULT_DAYS = expiresAt.days;
  //   }
  //   await this.prisma.token.create({
  //     data: {
  //       userId,
  //       token,
  //       expiresAt: new Date(
  //         new Date().getTime() + DEFAULT_DAYS * 24 * 60 * 60 * 1000,
  //       ), // 7 days expiration
  //     },
  //   });
  // }
}
