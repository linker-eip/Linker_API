import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class StudentSearchOptionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchString?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  lastName?: string;
}