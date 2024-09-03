import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class MissionTaskDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  studentId: number;

  @ApiProperty()
  @IsNumber()
  missionId: number;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  skills: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;
}
