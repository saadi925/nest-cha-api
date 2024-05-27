import { Controller, Post, Body, Put } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SigninDto, SignupDto } from "./dto/auth.dto";
import { EmailVerificationService } from "./email-verification.service";
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Post("signup")
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signup(signupDto);
  }

  @Post("signin")
  async signn(@Body() signin: SigninDto) {
    return await this.authService.signin(signin.email, signin.password);
  }

  @Put("email-verification")
  async verifyEmail(@Body() verificationData: any) {
    const { email, code } = verificationData;
    const isVerified = await this.emailVerificationService.verifyEmail(
      email,
      code,
    );
    return { verified: isVerified };
  }
}
