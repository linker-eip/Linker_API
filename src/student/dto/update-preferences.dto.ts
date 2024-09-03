import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdatePreferencesDto {
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
