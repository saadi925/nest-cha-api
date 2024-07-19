import {
    Injectable,
  } from "@nestjs/common";
  import { JwtService } from "@nestjs/jwt";
  import { User } from "mongo/schema/user.schema";
  import {  Types } from "mongoose";
  import axios from 'axios'
  
  interface JwtPayload {
    userId: Types.ObjectId;
  }
  
  @Injectable()
  export class TokenService {
    constructor(
      private readonly jwtService: JwtService,
    ) {}
  
     generateToken(user : User): string {
      const payload: JwtPayload = { userId : user._id as Types.ObjectId };
      
      return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
    }
    async getNewAccessToken(refreshToken: string): Promise<string> {
      try {
        const response = await axios.post(
          'https://accounts.google.com/o/oauth2/token',
          {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
          },
        );
  
        return response.data.access_token;
      } catch (error) {
        throw new Error('Failed to refresh the access token.');
      }
    }
    async isTokenExpired(token: string): Promise<boolean> {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
        );
  
        const expiresIn = response.data.expires_in;
  
        if (!expiresIn || expiresIn <= 0) {
          return true;
        }
      } catch (error) {
        return true;
      }
    }
  
    async revokeGoogleToken(token: string) {
      try {
        await axios.get(
          `https://accounts.google.com/o/oauth2/revoke?token=${token}`,
        );
      } catch (error) {
        console.error('Failed to revoke the token:', error);
      }
    }
  }
  