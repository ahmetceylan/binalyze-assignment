import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateTodoGroupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Group name must have at least 3 chars' })
  name: string;
}
