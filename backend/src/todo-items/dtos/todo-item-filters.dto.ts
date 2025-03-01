import { IsNumber, IsOptional, IsDate } from 'class-validator';

export class TodoItemFiltersDto {
  @IsOptional()
  @IsNumber()
  groupId?: number;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsDate()
  dueDateStart?: Date;

  @IsOptional()
  @IsDate()
  dueDateEnd?: Date;
}
