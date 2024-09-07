import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateStudentPreferencesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  mailNotifMessage: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  mailNotifGroup: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  @IsBoolean()
  mailNotifMission: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  mailNotifDocument: boolean;
}

export class UpdateCompanyPreferencesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  mailNotifMessage: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  @IsBoolean()
  mailNotifMission: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  mailNotifDocument: boolean;
}
