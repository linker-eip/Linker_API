import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { MissionStatus } from '../enum/mission-status.enum';
import { MissionTaskDto } from './mission-task.dto';
import { StudentProfileResponseDto } from '../../student/dto/student-profile-response.dto';
import { GetGroupeResponse } from '../../group/dto/get-group-response-dto';
import { CompanyProfileResponseDto } from '../../company/dto/company-profile-response.dto';

export class GetMissionDetailsDto {
  @ApiProperty()
  @IsNumber()
  Id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEnum(MissionStatus)
  status: MissionStatus;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  companyId: number;

  @ApiProperty()
  @IsNumber()
  groupId: number;

  @ApiProperty()
  @IsString()
  startOfMission: Date;

  @ApiProperty()
  @IsString()
  endOfMission: Date;

  @ApiProperty()
  @IsString()
  createdAt: Date;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  skills: string;
}

export class StudentProfileResponseMissionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  studentId: number;

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

  @ApiProperty()
  website: string;

  @ApiProperty()
  note: number;
}

export class MissionTaskArrayDto {
  @ApiProperty({ isArray: true, type: MissionTaskDto })
  @IsArray()
  missionTasks: MissionTaskDto[];

  @ApiProperty({ isArray: true, type: StudentProfileResponseMissionDto })
  @IsArray()
  studentProfile: StudentProfileResponseMissionDto[];
}

export class GetMissionDetailsCompanyDto {
  @ApiProperty()
  company: CompanyProfileResponseDto;

  @ApiProperty()
  mission: GetMissionDetailsDto;

  @ApiProperty({ isArray: true, type: MissionTaskArrayDto })
  @IsArray()
  missionTaskArray: MissionTaskArrayDto[];

  @ApiProperty()
  group: GetGroupeResponse;

  @ApiProperty({ isArray: true, type: StudentProfileResponseMissionDto })
  groupStudents: StudentProfileResponseMissionDto[];
}
