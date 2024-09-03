import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Ticket,
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

  async createTicket(req: any, createTicket: CreateTicketDto): Promise<Ticket> {
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
    return this.ticketRepository.save(ticket);
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
}
