import { ApiProperty } from '@nestjs/swagger';
import { Studies } from '../studies/entity/studies.entity';
import { Skills } from '../skills/entity/skills.entity';
import { Jobs } from '../jobs/entity/jobs.entity';
import { StudiesDto } from '../studies/dto/studies.dto';
import { SkillsDto } from '../skills/dto/skills.dto';
import { JobsDto } from '../jobs/dto/jobs.dto';
import { UpdateSkillsDto } from './create-student-profile.dto';

export class StudentProfileResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  picture: string;

  @ApiProperty({type : StudiesDto, isArray : true})
  studies: Studies[];

  @ApiProperty({type : UpdateSkillsDto})
  skills: UpdateSkillsDto;

  @ApiProperty({type : JobsDto, isArray : true})
  jobs: Jobs[];

  @ApiProperty()
  website: string;
}
