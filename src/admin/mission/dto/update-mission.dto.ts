import { ApiProperty } from '@nestjs/swagger';
import { MissionStatus } from '../../../mission/enum/mission-status.enum';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateMission {
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
  @IsEnum(MissionStatus)
  status: MissionStatus;

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

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  companyId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  groupId: number;
}
