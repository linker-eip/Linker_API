import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { MissionTaskStatus } from '../enum/mission-task-status.enum';

export class UpdateMissionTaskDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  studentId?: number;

  @ApiProperty()
  @IsEnum(MissionTaskStatus)
  @IsOptional()
  status?: MissionTaskStatus;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  skills?: string;
}
