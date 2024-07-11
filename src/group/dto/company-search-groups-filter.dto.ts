import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CompanySearchGroupsFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  missionId?: number;

}
