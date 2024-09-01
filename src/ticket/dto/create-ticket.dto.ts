import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength } from 'class-validator';
import { TicketTypeEnum } from '../entity/Ticket.entity';
import { Optional } from '@nestjs/common';

export class CreateTicketDto {
  @ApiProperty({description: "Titre du ticket"})
  @IsString()
  @MaxLength(32, {message: "Le titre du ticket ne peut pas contenir plus de 32 caractères"})
  title: string;

  @ApiProperty({description: "Contenu du ticket"})
  @IsString()
  content: string;

  @ApiProperty({description: "Type de ticket"})
  @IsEnum(TicketTypeEnum)
  ticketType: TicketTypeEnum;

  @ApiProperty({description: "Identifiant de l'entité"})
  @Optional()
  entityId?: number;
}