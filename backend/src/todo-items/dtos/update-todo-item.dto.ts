import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateTodoItemDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  priority?: number;

  @IsDateString()
  @IsOptional()
  due_date?: Date;

  @IsNumber()
  @IsOptional()
  groupId?: number;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
