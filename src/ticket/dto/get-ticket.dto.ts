import { TicketStateEnum, TicketTypeEnum } from '../entity/Ticket.entity';
import { IsEnum, IsOptional } from 'class-validator';
import { Optional } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTicketsDto {
  @IsEnum(TicketTypeEnum)
  @IsOptional()
  @ApiPropertyOptional()
  ticketType?: TicketTypeEnum;

  @IsEnum(TicketStateEnum)
  @IsOptional()
  @ApiPropertyOptional()
  state?: TicketStateEnum;
}
