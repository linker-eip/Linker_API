import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerTicketDto {
  @IsString()
  @ApiProperty({ description: 'Message' })
  content: string;

  @ApiProperty({ description: 'Fichier' })
  @IsOptional()
  file?: Express.Multer.File;
}
