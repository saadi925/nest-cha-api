import { Controller, Post, Body, Put, UseGuards, Req, Res } from "@nestjs/common";
import { AuthService, GoogleCreateUser } from "./auth.service";
import { SigninDto, SignupDto } from "./dto/auth.dto";
import { FastifyReplyExpress } from "src/types/Requests";
import { TokenService } from "./token.service";
import { GoogleAuthCreateGuard } from "./google-auth/google-auth.guard";
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService : TokenService
  ) {}

  @Post("signup")
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signup(signupDto);
  }

  @Post("signin")
  async signn(@Body() signin: SigninDto,@Res() res : FastifyReplyExpress) {
    
  const resObj =  await this.authService.signin(
    signin.email, 
    signin.password
  );  
  
  return res.send(resObj);
}
@UseGuards(GoogleAuthCreateGuard)
@Post('create_google_account')
async createGoogleAccount(@Body() googleData : GoogleCreateUser) {
  return await this.authService.createGoogleAccount(googleData);
}
  @Put("email-verification")
  async verifyEmail(@Body() verificationData: any, res : FastifyReplyExpress) {
    const { email, code } = verificationData;
    const resObj = await this.authService.handleEmailVerification(
      email,
      code,
    )
  return resObj
  }

  // @Get('logout')
  // logout(@Req() req : FastifyRequestExpress, @Res() res: FastifyReplyExpress) {
  //   const refreshToken = req.cookies['refresh_token'];
  //   res.clearCookie('access_token');
  //   res.clearCookie('refresh_token');
  //   this.tokenService.revokeGoogleToken(refreshToken);
  //   res.redirect('http://localhost:3000/');
  // }







  // @Get('google')
  // @UseGuards(GoogleOauthGuard)
  // googleLogin(@Req() _req ) {}

  // @Get('callback/google')
  // @UseGuards(GoogleOauthGuard)
  // async googleAuthCallback(@Req() req : FastifyRequestExpress, @Res() res :FastifyReplyExpress) {
  //   try {
       
  //     const token = await this.authService.oAuthLogin(req.user);
  //     res.cookie('auth_token', token.jwt, {
  //       httpOnly: true,
  //       secure: true, // set to true if using https
  //       sameSite: 'strict', // helps mitigate CSRF
  //       path: '/',
  //       maxAge: 3600000 // set cookie expiry as needed
  //     });
  //     if (token) {
  //   return res.redirect(301 ,`http://localhost:3000/auth/auth-check` )    
  // }      
  //   } catch (err) {
  //     res.status(500).send({ success: false, message: err.message });
  //   }
  // }
  
}
