import { ApiProperty } from "@nestjs/swagger";

export class MissionTaskDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    studentId: number;

    @ApiProperty()
    missionId: number;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    skills: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    createdAt: Date;
}