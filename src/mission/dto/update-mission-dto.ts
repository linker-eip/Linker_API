import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MissionStatus } from '../enum/mission-status.enum';

export class UpdateMissionDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  startOfMission: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endOfMission: Date;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  amount: number;
}
