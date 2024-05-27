import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class SignupDto {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty({ message: "password is required" })
  @MinLength(8) // Example: Minimum length of 8 characters
  password: string;
}
export class SigninDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(8) // Example: Minimum length of 8 characters
  password: string;
}
