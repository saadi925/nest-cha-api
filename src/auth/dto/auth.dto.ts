import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class SignupDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  displayname?: string;
  @IsOptional()
  @IsString()
  @MaxLength(200)
  avatar?: string;


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
