import { ApiProperty } from "@nestjs/swagger";

export class GetMissionDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    companyId: number;

    @ApiProperty()
    groupId: number;

    @ApiProperty()
    startOfMission: Date;

    @ApiProperty()
    endOfMission: Date;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    skills: string;
}