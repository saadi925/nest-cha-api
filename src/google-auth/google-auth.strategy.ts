// import { Inject, Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { PassportStrategy } from '@nestjs/passport';  
// import { configDotenv } from 'dotenv';
// import { User, UserDocument } from 'mongo/schema/user.schema';
// import { Model } from 'mongoose';
// import { Strategy, VerifyCallback } from 'passport-google-oauth2';
// import { AuthService } from 'src/auth';

// configDotenv();

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(
//     @InjectModel(User.name) private readonly userModel : Model<UserDocument>, 
//     private readonly authService : AuthService
//   ) {
//     super({
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_REDIRECT_URI,
//       scope: ['profile', 'email'],
//     });
//   }
//   // make sure to add this or else you won't get the refresh token
//   authorizationParams(): { [key: string]: string } {
//     return {
//       access_type: 'offline',
//       prompt: 'consent',
//     };
//   }
//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallback,
//   ): Promise<any> {
//     const { id, name, emails, photos } = profile;
//  let user = await this.userModel.findOne({providerId : id}).exec()
//  if (user) {
//   const token = this.authService.generateToken(user);
//   return done(null, { user, token });
// }

// if (!user) {
//   const data = {
//     provider: 'google',
//     providerId: id,
//     email: emails[0].value,
//     name: `${name.givenName} ${name.familyName}`,
//     avatar: photos[0].value,
//     refreshToken,
//     verified : true
//   }
//   user = await this.authService.createUser(data);
//   await user.save();
// } else {
//   // Update refresh token if needed
//   user.refreshToken = refreshToken;
//   await user.save();
// }
 
//     done(null, user);
//   }
// }