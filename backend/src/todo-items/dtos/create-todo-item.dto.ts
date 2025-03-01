import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateTodoItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  priority: number;

  @IsDateString()
  @IsNotEmpty()
  due_date: Date;

  @IsNumber()
  @IsNotEmpty()
  groupId: number;
}
