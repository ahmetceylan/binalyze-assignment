import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class RegisterResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  message: string;

  @IsNumber()
  userId: number;
}
