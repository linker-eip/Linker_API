import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket, TicketAnswer, TicketStateEnum, TicketTypeEnum } from './entity/Ticket.entity';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { StudentUser } from '../student/entity/StudentUser.entity';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { UserType } from '../chat/entity/Message.entity';
import { StudentModule } from '../student/student.module';
import { CompanyModule } from '../company/company.module';
import { DocumentTransferModule } from '../document-transfer/src/document-transfer.module';
import { NotificationsService } from '../notifications/notifications.service';
import { StudentService } from '../student/student.service';
import { CompanyService } from '../company/company.service';
import { SkillsService } from '../student/skills/skills.service';
import { JobsService } from '../student/jobs/jobs.service';
import { MailService } from '../mail/mail.service';
import { StudiesService } from '../student/studies/studies.service';
import { FileService } from '../filesystem/file.service';
import { DocumentTransferService } from '../document-transfer/src/services/document-transfer.service';
import { CompanyProfile } from '../company/entity/CompanyProfile.entity';
import { ConfigService } from '@nestjs/config';
import { Notification } from '../notifications/entity/Notification.entity';
import { CompanyUser } from '../company/entity/CompanyUser.entity';
import { StudentProfile } from '../student/entity/StudentProfile.entity';
import { Skills } from '../student/skills/entity/skills.entity';
import { Jobs } from '../student/jobs/entity/jobs.entity';
import { Studies } from '../student/studies/entity/studies.entity';
import { StudentPreferences } from '../student/entity/StudentPreferences.entity';
import { CompanyPreferences } from '../company/entity/CompanyPreferences.entity';
import { StudentDocument } from '../student/entity/StudentDocuments.entity';
import { CompanyDocument } from '../company/entity/CompanyDocument.entity';
import { Mission } from '../mission/entity/mission.entity';

describe('TicketService', () => {
  let service: TicketService;
  let controller: TicketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [TicketController],
      providers: [
        TicketService,
        NotificationsService,
        StudentService,
        CompanyService,
        SkillsService,
        JobsService,
        MailService,
        StudiesService,
        FileService,
        DocumentTransferService,
        CompanyProfile,
        ConfigService,
        {
          provide: getRepositoryToken(Notification),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentProfile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyProfile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Skills),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Jobs),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Studies),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentPreferences),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyPreferences),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentDocument),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyDocument),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Ticket),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Mission),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(TicketAnswer),
          useClass: Repository,
        },
        {
          provide: 'MAILER_PROVIDER',
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(PassportModule)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TicketController>(TicketController);
    service = module.get<TicketService>(TicketService);
  });

  describe('createTicket', () => {
    it('should create a ticket', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const createTicketDto = {
        title: 'Test ticket',
        content: 'Test content',
        ticketType: TicketTypeEnum.GENERAL,
      };

      const expectedResponse = {
        id: 1,
        authorId: 1,
        authorType: UserType.STUDENT_USER,
        title: 'Test ticket',
        content: 'Test content',
        attachment: null,
        ticketType: TicketTypeEnum.GENERAL,
        state: TicketStateEnum.OPEN,
        date: new Date(),
      };

      jest.spyOn(service, 'createTicket').mockResolvedValueOnce(expectedResponse);

      const response = await controller.createTicket(req, createTicketDto, null);

      expect(service.createTicket).toHaveBeenCalledWith(req, createTicketDto, null);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('getUserTickets', () => {
    it('should get tickets', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };


      const expectedResponse = [{
        id: 1,
        authorId: 1,
        authorType: UserType.STUDENT_USER,
        title: 'Test ticket',
        content: 'Test content',
        attachment: null,
        ticketType: TicketTypeEnum.GENERAL,
        state: TicketStateEnum.OPEN,
        date: new Date(),
      }];

      jest.spyOn(service, 'getUserTickets').mockResolvedValueOnce(expectedResponse);

      const response = await controller.getUserTickets(req, {});

      expect(service.getUserTickets).toHaveBeenCalledWith(req, {});
      expect(response).toEqual(expectedResponse);
    });

  });

  describe('answerTicket', () => {
    it('should create ticket answer', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const dto = {
        content: 'Answer test',
        file: null,
      };

      const expectedResponse = {
        id: 1,
        ticketId: 1,
        author: 'USER' as 'USER' | 'ADMIN',
        content: 'Answer test',
        attachment: null,
        date: new Date(),
      };

      jest.spyOn(service, 'answerTicket').mockResolvedValueOnce(expectedResponse);

      const response = await controller.answerTicket(req, dto, null, 1);

      expect(service.answerTicket).toHaveBeenCalledWith(req, dto, null, 1);
      expect(response).toEqual(expectedResponse);
    });

  });

  describe('getTicketById', () => {
    it('should get ticket', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };


      const expectedResponse = {
        id: 1,
        authorId: 1,
        authorType: UserType.STUDENT_USER,
        title: 'Test ticket',
        content: 'Test content',
        attachment: null,
        ticketType: TicketTypeEnum.GENERAL,
        state: TicketStateEnum.OPEN,
        date: new Date(),
        answer: [],
      };

      jest.spyOn(service, 'getTicketById').mockResolvedValueOnce(expectedResponse);

      const response = await controller.getTicketById(req, 1);

      expect(service.getTicketById).toHaveBeenCalledWith(req, 1);
      expect(response).toEqual(expectedResponse);
    });

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});