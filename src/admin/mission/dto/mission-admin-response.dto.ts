import { ApiProperty } from "@nestjs/swagger";
import { CompanyUser } from "../../../company/entity/CompanyUser.entity";
import { Mission } from "../../../mission/entity/mission.entity";
import { formatToCompanyAdminResponseDto } from "../../user-admin/dto/company-admin-response.dto";

export class missionAdminResponseDto{
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
    company : CompanyUser;
}


export function formatToMissionAdminDto(mission : Mission, company : CompanyUser) {
    return {
        id: mission.id,
        name: mission.name,
        status: mission.status,
        companyId: mission.companyId,
        studentsIds: mission.studentsIds,
        description: mission.description,
        startOfMission: mission.startOfMission,
        endOfMission: mission.endOfMission,
        amount: mission.amount,
        createdAt: mission.createdAt,
        numberOfStudents: mission.studentsIds.length,
        company : formatToCompanyAdminResponseDto(company)
    }
}