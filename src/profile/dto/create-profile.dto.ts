import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  avatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  orgainzation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  profileDescription?: string;
}
