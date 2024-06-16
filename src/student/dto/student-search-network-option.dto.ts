import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class StudentSearchNetworkOptionDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  skills?: string;

  @ApiPropertyOptional()
  @IsOptional()
  tjmMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  tjmMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  noteMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  noteMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  hasGroup?: boolean;
}