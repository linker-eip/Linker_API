import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsService } from '../../notifications/notifications.service';
import { StudentService } from '../../student/student.service';
import { CompanyService } from '../../company/company.service';
import { SkillsService } from '../../student/skills/skills.service';
import { JobsService } from '../../student/jobs/jobs.service';
import { MailService } from '../../mail/mail.service';
import { StudiesService } from '../../student/studies/studies.service';
import { FileService } from '../../filesystem/file.service';
import { DocumentTransferService } from '../../document-transfer/src/services/document-transfer.service';
import { CompanyProfile } from '../../company/entity/CompanyProfile.entity';
import { ConfigService } from '@nestjs/config';
import { Notification } from '../../notifications/entity/Notification.entity';
import { CompanyUser } from '../../company/entity/CompanyUser.entity';
import { StudentProfile } from '../../student/entity/StudentProfile.entity';
import { Skills } from '../../student/skills/entity/skills.entity';
import { Jobs } from '../../student/jobs/entity/jobs.entity';
import { Studies } from '../../student/studies/entity/studies.entity';
import { StudentPreferences } from '../../student/entity/StudentPreferences.entity';
import { CompanyPreferences } from '../../company/entity/CompanyPreferences.entity';
import { StudentDocument } from '../../student/entity/StudentDocuments.entity';
import { CompanyDocument } from '../../company/entity/CompanyDocument.entity';
import { Mission } from '../../mission/entity/mission.entity';
import { TicketAdminService } from './ticket-admin.service';
import { TicketAdminController } from './ticket-admin.controller';
import { Ticket, TicketAnswer, TicketStateEnum, TicketTypeEnum } from '../../ticket/entity/Ticket.entity';
import { TicketService } from '../../ticket/ticket.service';
import { UserType } from '../../chat/entity/Message.entity';

describe('AdminTicketService', () => {
  let service: TicketAdminService;
  let controller: TicketAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [TicketAdminController],
      providers: [
        TicketAdminService,
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

    controller = module.get<TicketAdminController>(TicketAdminController);
    service = module.get<TicketAdminService>(TicketAdminService);
  });

  describe('answerTicket', () => {
    it('should create ticket answer', async () => {
      const req = {
        user: {
          email: 'admin@example.com',
        },
      };

      const dto = {
        content: 'Answer test',
        file: null,
      };

      const expectedResponse = {
        id: 1,
        ticketId: 1,
        author: 'ADMIN' as 'USER' | 'ADMIN',
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

  describe('getTickets', () => {
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

      jest.spyOn(service, 'getTickets').mockResolvedValueOnce(expectedResponse);

      const response = await controller.getTickets({});

      expect(service.getTickets).toHaveBeenCalledWith({});
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

  describe('closeTicket', () => {
    it('should close a ticket', async () => {
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
        state: TicketStateEnum.CLOSED,
        date: new Date(),
        answer: [],
      };

      jest.spyOn(service, 'closeTicket').mockResolvedValueOnce(expectedResponse);

      const response = await controller.closeTicket(req, 1);

      expect(service.closeTicket).toHaveBeenCalledWith(req, 1);
      expect(response).toEqual(expectedResponse);
    });

  });

  describe('reopenTicket', () => {
    it('should reopen a ticket', async () => {
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

      jest.spyOn(service, 'reopenTicket').mockResolvedValueOnce(expectedResponse);

      const response = await controller.reopenTicket(req, 1);

      expect(service.reopenTicket).toHaveBeenCalledWith(req, 1);
      expect(response).toEqual(expectedResponse);
    });

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});