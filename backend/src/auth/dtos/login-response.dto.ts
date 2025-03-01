import { IsBoolean, IsString } from 'class-validator';

export class LoginResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  message: string;

  @IsString()
  access_token: string;
}
