import { ApiProperty } from '@nestjs/swagger';

export class StudiesDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  logo: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  duration: string;

  @ApiProperty()
  description: string;
}
