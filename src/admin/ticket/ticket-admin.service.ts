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
import { GetAnswerDto, GetTicketReponseDto } from '../../ticket/dto/get-ticket-reponse.dto';

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

  async getTicketById(req: any, ticketId: number): Promise<GetTicketReponseDto> {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new HttpException('Ticket not found', HttpStatusCode.NotFound);
    }

    const answers = await this.ticketAnswerRepository.find({ where: { ticketId } });

    const response = new GetTicketReponseDto();
    response.id = ticket.id;
    response.authorId = ticket.authorId;
    response.authorType = ticket.authorType;
    response.title = ticket.title;
    response.content = ticket.content;
    response.attachment = ticket.attachment;
    response.ticketType = ticket.ticketType;
    response.entityId = ticket.entityId;
    response.state = ticket.state;
    response.date = ticket.date;
    response.answer = answers.map(answer => {
      const getAnswer = new GetAnswerDto();
      getAnswer.id = answer.id;
      getAnswer.author = answer.author;
      getAnswer.content = answer.content;
      getAnswer.attachment = answer.attachment;
      getAnswer.date = answer.date;
      return getAnswer;
    });
    return response;
  }
}
