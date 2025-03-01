import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTodoGroupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Group name must be at least 3 characters long' })
  name: string;
}
