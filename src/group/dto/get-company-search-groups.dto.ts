import { ApiProperty } from '@nestjs/swagger';
import { Studies } from '../../student/studies/entity/studies.entity';
import { Skills } from '../../student/skills/entity/skills.entity';
import { Jobs } from '../../student/jobs/entity/jobs.entity';
import { IsNumber, IsString } from 'class-validator';
import { UpdateSkillsDto } from 'src/student/dto/create-student-profile.dto';

export class StudentProfileResponseDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsString()
  picture: string;

  @ApiProperty({ type: Studies, isArray: true })
  studies: Studies[];

  @ApiProperty({ type: Skills, isArray: true })
  skills: UpdateSkillsDto;

  @ApiProperty({ type: Jobs, isArray: true })
  jobs: Jobs[];

  @ApiProperty()
  @IsString()
  website: string;

  @ApiProperty()
  @IsNumber()
  note: number;
}

export class GetCompanySearchGroupsDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: StudentProfileResponseDto, isArray: true })
  studentsProfiles: StudentProfileResponseDto[];
}
