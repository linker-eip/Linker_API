import { ApiProperty } from "@nestjs/swagger";
import { GetMissionDto } from "src/mission/dto/get-mission.dto";

export class ReviewDto {
    @ApiProperty()
    missionId: number;

    @ApiProperty()
    review: string;
}

export class StudentStatsResponse {
    @ApiProperty()
    missions: GetMissionDto[]

    @ApiProperty()
    reviews: ReviewDto[]

    @ApiProperty()
    note: number;

    @ApiProperty()
    noteNumber: number;
}