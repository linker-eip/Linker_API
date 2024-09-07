import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Ticket,
  TicketAnswer,
  TicketStateEnum,
  TicketTypeEnum,
} from './entity/Ticket.entity';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UserType } from '../chat/entity/Message.entity';
import { StudentUser } from '../student/entity/StudentUser.entity';
import { CompanyUser } from '../company/entity/CompanyUser.entity';
import { HttpStatusCode } from 'axios';
import { Mission } from '../mission/entity/mission.entity';
import { GetTicketsDto } from './dto/get-ticket.dto';
import { DocumentTransferService } from '../document-transfer/src/services/document-transfer.service';
import { AnswerTicketDto } from './dto/answer-ticket.dto';
import {
  GetAnswerDto,
  GetTicketReponseDto,
} from './dto/get-ticket-reponse.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(StudentUser)
    private readonly studentRepository: Repository<StudentUser>,
    @InjectRepository(CompanyUser)
    private readonly companyRepository: Repository<CompanyUser>,
    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>,
    @InjectRepository(TicketAnswer)
    private readonly ticketAnswerRepository: Repository<TicketAnswer>,
    private readonly documentTransferService: DocumentTransferService,
  ) {
  }

  private async checkStudentRight(
    user: StudentUser,
    entityId: number,
    entityType: TicketTypeEnum,
  ): Promise<boolean> {
    if (entityType == TicketTypeEnum.GENERAL) {
      return true;
    } else if (entityType == TicketTypeEnum.GROUP) {
      return user.groupId == entityId;
    } else if (entityType == TicketTypeEnum.MISSION) {
      const mission = this.missionRepository.findOne({
        where: { id: entityId, groupId: user.groupId },
      });
      return mission != null;
    }
    return false;
  }

  private async checkCompanyRight(
    user: CompanyUser,
    entityId: number,
    entityType: TicketTypeEnum,
  ): Promise<boolean> {
    if (entityType == TicketTypeEnum.GENERAL) {
      return true;
    } else if (entityType == TicketTypeEnum.GROUP) {
      return true;
    } else if (entityType == TicketTypeEnum.MISSION) {
      const mission = this.missionRepository.findOne({
        where: { id: entityId, companyId: user.id },
      });
      return mission != null;
    }
    return false;
  }

  async createTicket(
    req: any,
    createTicket: CreateTicketDto,
    file?: Express.Multer.File,
  ): Promise<Ticket> {
    const ticket = new Ticket();
    let user;
    if (req.user.userType == 'USER_STUDENT') {
      user = await this.studentRepository.findOne({
        where: { email: req.user.email },
      });
      if (
        !(await this.checkStudentRight(
          user,
          createTicket.entityId,
          createTicket.ticketType,
        ))
      ) {
        throw new HttpException(
          'You do not have the right to create a ticket for this entity',
          HttpStatusCode.Forbidden,
        );
      }
    } else {
      user = await this.companyRepository.findOne({
        where: { email: req.user.email },
      });
      if (
        !(await this.checkCompanyRight(
          user,
          createTicket.entityId,
          createTicket.ticketType,
        ))
      ) {
        throw new HttpException(
          'You do not have the right to create a ticket for this entity',
          HttpStatusCode.Forbidden,
        );
      }
    }
    ticket.title = createTicket.title;
    ticket.content = createTicket.content;
    ticket.ticketType = createTicket.ticketType;
    if (ticket.ticketType != TicketTypeEnum.GENERAL) {
      if (!createTicket.entityId) {
        throw new HttpException(
          'entityId is required for ticket type ' + ticket.ticketType,
          HttpStatusCode.BadRequest,
        );
      }
      ticket.entityId = createTicket.entityId;
    }
    ticket.authorId = user.id;
    ticket.authorType =
      req.user.userType == 'USER_STUDENT'
        ? UserType.STUDENT_USER
        : UserType.COMPANY_USER;
    ticket.state = TicketStateEnum.OPEN;
    if (file) {
      ticket.attachment = await this.documentTransferService.uploadFile(file);
    }
    return this.ticketRepository.save(ticket);
  }

  getUserTickets(req, body: GetTicketsDto) {
    const options = {};
    if (req.user.userType == 'USER_STUDENT') {
      options['authorType'] = UserType.STUDENT_USER;
    } else {
      options['authorType'] = UserType.COMPANY_USER;
    }

    options['authorId'] = req.user.id;
    if (body.ticketType) {
      options['ticketType'] = body.ticketType;
    }
    if (body.state) {
      options['state'] = body.state;
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
    answer.author = 'USER';
    return this.ticketAnswerRepository.save(answer);
  }

  async getTicketById(
    req: any,
    ticketId: number,
  ): Promise<GetTicketReponseDto> {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId, authorId: req.user.id },
    });
    if (!ticket) {
      throw new HttpException('Ticket not found', HttpStatusCode.NotFound);
    }

    const answers = await this.ticketAnswerRepository.find({
      where: { ticketId },
    });

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
    response.answer = answers.map((answer) => {
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
