import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { MissionTaskStatus } from "../enum/mission-task-status.enum";

export class UpdateMissionTaskDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    studentId: number;

    @ApiProperty()
    @IsEnum(MissionTaskStatus)
    @IsOptional()
    status: MissionTaskStatus;
}