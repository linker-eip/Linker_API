import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateContactDto {
  @ApiProperty()
  @IsOptional()
  isTreated?: boolean;
}
