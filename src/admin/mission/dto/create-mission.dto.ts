import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateMissionDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDateString()
  startOfMission: Date;

  @ApiProperty()
  @IsDateString()
  endOfMission: Date;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNumber()
  companyId: number;

  @ApiProperty({ type: 'array', items: { type: 'number' }})
  @IsNumber({}, { each: true })
  studentsIds: number[];
}
