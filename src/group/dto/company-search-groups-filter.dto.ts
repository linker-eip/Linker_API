import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CompanySearchGroupsFilterDto {
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
  @IsString()
  groupName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  skills?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  size?: number;
}
