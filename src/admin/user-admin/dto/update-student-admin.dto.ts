import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateStudentAdminDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  isActive?: boolean;
}
