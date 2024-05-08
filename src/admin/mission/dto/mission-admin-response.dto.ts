import { ApiProperty } from '@nestjs/swagger';
import { CompanyUser } from '../../../company/entity/CompanyUser.entity';
import { Mission } from '../../../mission/entity/mission.entity';
import { CompanyAdminResponseDto, formatToCompanyAdminResponseDto } from '../../user-admin/dto/company-admin-response.dto';
import { StudentUser } from '../../../student/entity/StudentUser.entity';

export class missionAdminResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  startOfMission: Date;

  @ApiProperty()
  endOfMission: Date;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  numberOfStudents: number;

  @ApiProperty()
  company: CompanyUser;
}

export function formatToMissionAdminDto(
  mission: Mission,
  company: CompanyUser,
  students: StudentUser[],
) {
  return {
    id: mission.id,
    name: mission.name,
    status: mission.status,
    companyId: mission.companyId,
    groupId: mission.groupId,
    description: mission.description,
    startOfMission: mission.startOfMission,
    endOfMission: mission.endOfMission,
    amount: mission.amount,
    createdAt: mission.createdAt,
    numberOfStudents: null,
    company: formatToCompanyAdminResponseDto(company),
    students: students.map((student) => {
      return {
        name: student?.firstName + ' ' + student?.lastName,
      };
    }),
  };
}


export class missionAdminResponseBasicDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  startOfMission: Date;

  @ApiProperty()
  endOfMission: Date;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  numberOfStudents: number;

  @ApiProperty()
  company: CompanyAdminResponseDto;
}

export function formatToMissionAdminBasicDto(
  mission: Mission,
  company: CompanyUser,
) : missionAdminResponseBasicDto {
  return {
    id: mission.id,
    name: mission.name,
    status: mission.status,
    description: mission.description,
    startOfMission: mission.startOfMission,
    endOfMission: mission.endOfMission,
    amount: mission.amount,
    numberOfStudents: null,
    company: formatToCompanyAdminResponseDto(company),
  };
}