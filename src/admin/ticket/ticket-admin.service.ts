import { HttpException, Injectable } from '@nestjs/common';
import { GetTicketsDto } from '../../ticket/dto/get-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Ticket,
  TicketAnswer,
  TicketStateEnum,
} from '../../ticket/entity/Ticket.entity';
import { Repository } from 'typeorm';
import { AnswerTicketDto } from '../../ticket/dto/answer-ticket.dto';
import { HttpStatusCode } from 'axios';
import { DocumentTransferService } from '../../document-transfer/src/services/document-transfer.service';

@Injectable()
export class TicketAdminService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketAnswer)
    private readonly ticketAnswerRepository: Repository<TicketAnswer>,
    private readonly documentTransferService: DocumentTransferService,
  ) {
  }

  async getTickets(getTicketDto: GetTicketsDto) {
    const options = {};
    if (getTicketDto.ticketType) {
      options['ticketType'] = getTicketDto.ticketType;
    }
    if (getTicketDto.state) {
      options['state'] = getTicketDto.state;
    }
    return this.ticketRepository.find({ where: options });
  }

  async answerTicket(
    req,
    body: AnswerTicketDto,
    file: Express.Multer.File,
    ticketId: number,
  ) {
    const ticket = await this.ticketRepository.findOne({
      where: {
        id: ticketId,
        authorId: req.user.id,
        state: TicketStateEnum.OPEN,
      },
    });
    if (!ticket) {
      throw new HttpException('Ticket not found', HttpStatusCode.NotFound);
    }
    const answer = new TicketAnswer();
    answer.ticketId = ticketId;
    answer.content = body.content;
    if (file) {
      answer.attachment = await this.documentTransferService.uploadFile(file);
    }
    answer.author = 'ADMIN';
    return this.ticketAnswerRepository.save(answer);
  }
}
