import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class UpdateNotificationsDto {
  @ApiProperty()
  @IsArray()
  ids: number[];
}
