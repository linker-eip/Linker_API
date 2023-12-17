import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { MissionTaskStatus, MissionTaskStatusStudent } from "../enum/mission-task-status.enum";

export class UpdateTaskStatusDto {
    @ApiProperty({
        description: 'The status of the task',
        enum: MissionTaskStatus,
      })
    @IsEnum(MissionTaskStatus)
    status: MissionTaskStatus;
}