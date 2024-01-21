import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { MissionStatus } from "../enum/mission-status.enum";

export class MissionSearchOptionStudentDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(MissionStatus)
    status?: MissionStatus;
}