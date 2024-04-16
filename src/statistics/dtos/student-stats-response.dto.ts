import { ApiProperty } from "@nestjs/swagger";
import { GetMissionDto } from "src/mission/dto/get-mission.dto";

export class ReviewDto {
    @ApiProperty()
    missionId: number;

    @ApiProperty()
    review: string;
}

export class IncomeDto {
    @ApiProperty()
    missionId: number;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    paymentDate: Date;
}

export class StudentStatsResponse {
    @ApiProperty({type: GetMissionDto, isArray: true})
    missions: GetMissionDto[]

    @ApiProperty({type: ReviewDto, isArray: true})
    reviews: ReviewDto[]

    @ApiProperty()
    note: number;

    @ApiProperty()
    noteNumber: number;

    @ApiProperty({type: IncomeDto, isArray: true})
    incomes: IncomeDto[];
}