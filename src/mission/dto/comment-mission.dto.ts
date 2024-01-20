import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CommentMissionDto {
  @ApiProperty()
  @IsString()
  comment: string;
}
