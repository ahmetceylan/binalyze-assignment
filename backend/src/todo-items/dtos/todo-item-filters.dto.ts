import { IsOptional, IsNumber, IsDateString, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TodoItemFiltersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  groupId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priority?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDateStart?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDateEnd?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @Transform(({ value }) => (value === 'true' ? true : false))
  completed?: boolean;
}
