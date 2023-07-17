import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class StudentSearchOptionAdminDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchString?: string;

  @ApiPropertyOptional()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  email?: string;
  
  @ApiPropertyOptional()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  lastName?: string;
}