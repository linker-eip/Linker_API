import { ApiProperty } from '@nestjs/swagger';

export class CompanyProfileResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  location: string;

  @ApiProperty()
  activity: string;

  @ApiProperty()
  speciality: string;

  @ApiProperty()
  website: string;

  @ApiProperty()
  picture: string;
}
