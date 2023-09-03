import { ApiProperty } from '@nestjs/swagger';
import { Studies } from '../studies/entity/studies.entity';
import { Skills } from '../skills/entity/skills.entity';
import { Jobs } from '../jobs/entity/jobs.entity';
import { StudiesDto } from '../studies/dto/studies.dto';
import { SkillsDto } from '../skills/dto/skills.dto';
import { JobsDto } from '../jobs/dto/jobs.dto';

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

  @ApiProperty({type : SkillsDto, isArray : true})
  skills: Skills[];

  @ApiProperty({type : JobsDto, isArray : true})
  jobs: Jobs[];

  @ApiProperty()
  website: string;
}

export function studentProfileResponseDto(studentProfileResponse : StudentProfileResponseDto) {
  const dto = new StudentProfileResponseDto();
  dto.id = studentProfileResponse.id;
  dto.firstName = studentProfileResponse.firstName;
  dto.lastName = studentProfileResponse.lastName;
  dto.description = studentProfileResponse.description;
  dto.email = studentProfileResponse.email;
  dto.phone = studentProfileResponse.phone;
  dto.location = studentProfileResponse.location;
  dto.studies = studentProfileResponse.studies;
  dto.skills = studentProfileResponse.skills;
  dto.jobs = studentProfileResponse.jobs;
  dto.website = studentProfileResponse.website;
  return dto;
}