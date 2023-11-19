import { ApiProperty } from '@nestjs/swagger';
import { StudentProfile } from '../../entity/StudentProfile.entity';

export class JobsDto {
  @ApiProperty()
  id: number;

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
