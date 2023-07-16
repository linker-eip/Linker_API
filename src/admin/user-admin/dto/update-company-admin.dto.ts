import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCompanyAdminDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  picture?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  companyPicture?: string;

  @ApiProperty()
  @IsOptional()
  isActive?: boolean;
}
