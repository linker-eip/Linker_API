import { Repository } from 'typeorm';
import { ChatService } from './chat.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { Message, MessageType } from './entity/Message.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { StudentService } from '../student/student.service';
import { CompanyService } from '../company/company.service';
import { GroupService } from '../group/group.service';
import { MissionService } from '../mission/mission.service';
import { DocumentTransferService } from '../document-transfer/src/services/document-transfer.service';
import { Gateway } from './gateway';
import { Mission } from '../mission/entity/mission.entity';
import { MissionTask } from '../mission/entity/mission-task.entity';
import { MissionInvite } from '../mission/entity/mission-invite.entity';
import { CompanyProfile } from '../company/entity/CompanyProfile.entity';
import { CompanyDocument } from '../company/entity/CompanyDocument.entity';
import { PaymentService } from '../payment/payment.service';
import { Payment } from '../payment/entity/payment.entity';
import { StudentPayment } from '../payment/entity/student-payment.entity';
import { StudentUser } from '../student/entity/StudentUser.entity';
import { StudentProfile } from '../student/entity/StudentProfile.entity';
import { StudentPreferences } from '../student/entity/StudentPreferences.entity';
import { StudentDocument } from '../student/entity/StudentDocuments.entity';
import { Jobs } from '../student/jobs/entity/jobs.entity';
import { Studies } from '../student/studies/entity/studies.entity';
import { SkillsService } from '../student/skills/skills.service';
import { JobsService } from '../student/jobs/jobs.service';
import { StudiesService } from '../student/studies/studies.service';
import { FileService } from '../filesystem/file.service';
import { CompanyUser } from '../company/entity/CompanyUser.entity';
import { CompanyPreferences } from '../company/entity/CompanyPreferences.entity';
import { Group } from '../group/entity/Group.entity';
import { GroupInvite } from '../group/entity/GroupInvite.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { ConfigService } from '@nestjs/config';
import { Skills } from '../student/skills/entity/skills.entity';
import { Notification } from '../notifications/entity/Notification.entity';
import { MailService } from '../mail/mail.service';
import { SendFileInChatDto } from './dto/chat-send-file.dto';
import { CompanyConversationResponseDto } from './dto/company-conversation-response.dto';

describe('ChatService', () => {
  let service: ChatService;
  let controller: ChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [ChatController],
      providers: [
        ChatService,
        StudentService,
        CompanyService,
        GroupService,
        PaymentService,
        ConfigService,
        MissionService,
        DocumentTransferService,
        SkillsService,
        JobsService,
        StudiesService,
        NotificationsService,
        FileService,
        Gateway,
        MailService,
        {
          provide: getRepositoryToken(Message),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Mission),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MissionTask),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MissionInvite),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyDocument),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Payment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentPayment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentProfile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentPreferences),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentDocument),
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
          provide: getRepositoryToken(CompanyUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyProfile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyDocument),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyPreferences),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Skills),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Notification),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Group),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(GroupInvite),
          useClass: Repository,
        },
        {
          provide: 'MAILER_PROVIDER',
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    service = module.get<ChatService>(ChatService);
  });

  describe('sendFile', () => {
    it('should send a file through messages', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test-file.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: './uploads',
        filename: 'test-file.txt',
        path: './uploads/test-file.jpg',
        size: 1234,
        stream: null,
        buffer: Buffer.from(''),
      };

      const dto: SendFileInChatDto = {
        file,
        type: MessageType.GROUP,
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'sendFileInChat')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.sendFileInChat(file, req, dto);

      expect(service.sendFileInChat).toHaveBeenCalledWith(req, file, dto);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('getStudentConversations', () => {
    it('should retrieve all student conversations', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const expectedResponse = {
        groupChannel: {
          id: 1,
          name: 'Group',
          logo: 'group.jpg',
        },
        missionChannels: [
          {
            id: 1,
            name: 'Mission',
            logo: 'company.jpg',
          },
          {
            id: 2,
            name: 'Mission 2',
            logo: 'company2.jpg',
          },
        ],
        premissionChannels: [],
        dmChannels: [
          {
            id: 1,
            name: 'DM',
            logo: 'user.jpg',
          },
        ],
      };

      jest
        .spyOn(service, 'getStudentConversations')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.getStudentConversations(req);

      expect(service.getStudentConversations).toHaveBeenCalledWith(req);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('getCompanyConversations', () => {
    it('should retrieve all company conversations', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const expectedResponse: CompanyConversationResponseDto = {
        missionChannels: [
          {
            id: 1,
            name: 'Mission',
            logo: 'company.jpg',
            groupId: 1,
          },
          {
            id: 2,
            name: 'Mission 2',
            logo: 'company2.jpg',
            groupId: 2,
          },
        ],
        premissionChannels: [],
      };

      jest
        .spyOn(service, 'getCompanyConversations')
        .mockResolvedValueOnce(expectedResponse);

      const response: CompanyConversationResponseDto =
        await controller.getCompanyConversations(req);

      expect(service.getCompanyConversations).toHaveBeenCalledWith(req);

      expect(response).toEqual(expectedResponse);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
