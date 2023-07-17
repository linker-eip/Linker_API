import { ApiProperty } from '@nestjs/swagger';
import { CompanyUser } from '../../../company/entity/CompanyUser.entity';
import { IsDate, IsEmail, IsNumber, IsString } from 'class-validator';

export class CompanyAdminResponseDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  picture: string;

  @ApiProperty()
  @IsString()
  companyPicture: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  @IsDate()
  lastConnectedAt: Date;

  @ApiProperty()
  @IsDate()
  createdAt: Date;
}

export function formatToCompanyAdminResponseDto(
  companyUser: CompanyUser,
): CompanyAdminResponseDto {
  const companyAdminResponseDto = new CompanyAdminResponseDto();
  companyAdminResponseDto.id = companyUser.id;
  companyAdminResponseDto.email = companyUser.email;
  companyAdminResponseDto.companyName = companyUser.companyName;
  companyAdminResponseDto.phoneNumber = companyUser.phoneNumber;
  companyAdminResponseDto.picture = companyUser.picture;
  companyAdminResponseDto.companyPicture = companyUser.companyPicture;
  companyAdminResponseDto.isActive = companyUser.isActive;
  companyAdminResponseDto.lastConnectedAt = companyUser.lastConnectedAt;
  companyAdminResponseDto.createdAt = companyUser.createdAt;
  return companyAdminResponseDto;
}
