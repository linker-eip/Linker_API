import { ApiProperty } from '@nestjs/swagger';
import { Studies } from '../studies/entity/studies.entity';
import { Skills } from '../skills/entity/skills.entity';
import { Jobs } from '../jobs/entity/jobs.entity';

export class StudentProfileResponseDto {
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
  location: string;

  @ApiProperty()
  studies: Studies[];

  @ApiProperty()
  skills: Skills[];

  @ApiProperty()
  jobs: Jobs[];

  @ApiProperty()
  website: string;
}

export function studentProfileResponseDto(studentProfileResponse : StudentProfileResponseDto) {
  const dto = new StudentProfileResponseDto();
  dto.id = studentProfileResponse.id;
  dto.name = studentProfileResponse.name;
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