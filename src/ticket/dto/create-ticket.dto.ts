import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, MaxLength } from 'class-validator';
import { TicketTypeEnum } from '../entity/Ticket.entity';

export class CreateTicketDto {
  @ApiProperty({ description: 'Titre du ticket' })
  @IsString()
  @MaxLength(32, {
    message: 'Le titre du ticket ne peut pas contenir plus de 32 caractères',
  })
  title: string;

  @ApiProperty({ description: 'Contenu du ticket' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Identifiant de l\'entité' })
  @IsNumber()
  entityId: number;

  @ApiProperty({ description: 'Type de ticket' })
  @IsEnum(TicketTypeEnum)
  ticketType: TicketTypeEnum;
}
