import { UserType } from '../../chat/entity/Message.entity';
import { TicketStateEnum, TicketTypeEnum } from '../entity/Ticket.entity';

export class GetAnswerDto {
  id: number;
  author: 'USER' | 'ADMIN';
  content: string;
  attachment?: string;
  date: Date;
}

export class GetTicketReponseDto {
  id: number;
  authorId: number;
  authorType: UserType;
  title: string;
  content: string;
  attachment?: string;
  ticketType: TicketTypeEnum;
  entityId?: number;
  state: TicketStateEnum;
  date: Date;
  answer: GetAnswerDto[];
}
