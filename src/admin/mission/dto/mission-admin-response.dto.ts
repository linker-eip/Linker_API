import { ApiProperty } from "@nestjs/swagger";

export class missionAdminResponseDto{
    @ApiProperty()
    id: number;
    
    @ApiProperty()
    name: string;

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
}