import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MissionService } from '../../mission/mission.service';
import { StudentService } from '../../student/student.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Mission } from '../../mission/entity/mission.entity';
import { CompanyUser } from '../../company/entity/CompanyUser.entity';
import { CompanyProfile } from '../../company/entity/CompanyProfile.entity';
import { Repository } from 'typeorm';
import { MissionTask } from '../../mission/entity/mission-task.entity';
import { MissionInvite } from '../../mission/entity/mission-invite.entity';
import { Group } from '../../group/entity/Group.entity';
import { GroupInvite } from '../../group/entity/GroupInvite.entity';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { StudentProfile } from '../../student/entity/StudentProfile.entity';
import { Skills } from '../../student/skills/entity/skills.entity';
import { Jobs } from '../../student/jobs/entity/jobs.entity';
import { Studies } from '../../student/studies/entity/studies.entity';
import { Notification } from '../../notifications/entity/Notification.entity';
import { CompanyService } from '../../company/company.service';
import { CompanyDocument } from '../../company/entity/CompanyDocument.entity';
import { CompanyPreferences } from '../../company/entity/CompanyPreferences.entity';
import { StudentDocument } from '../../student/entity/StudentDocuments.entity';
import { StudentPreferences } from '../../student/entity/StudentPreferences.entity';
import { DocumentTransferService } from '../../document-transfer/src/services/document-transfer.service';
import { ConfigService } from '@nestjs/config';
import { GroupService } from '../../group/group.service';
import { SkillsService } from '../../student/skills/skills.service';
import { JobsService } from '../../student/jobs/jobs.service';
import { StudiesService } from '../../student/studies/studies.service';
import { FileService } from '../../filesystem/file.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { MailService } from '../../mail/mail.service';
import { SkillsController } from './skills.controller';
import { SkillList } from './consts/skills-list';
import { PaymentService } from '../../payment/payment.service';
import { Payment } from '../../payment/entity/payment.entity';
import { StudentPayment } from '../../payment/entity/student-payment.entity';
import { AiService } from '../../ai/ai.service';
import { InvoiceService } from '../../invoice/invoice.service';

describe('SkillsService', () => {
  let service: SkillsService;
  let controller: SkillsController;

  const mockInvoiceService = {
    generateInvoice: jest.fn(),
    generateInvoiceForCompany: jest.fn(),
    downloadInvoice: jest.fn(),
    getInvoicesForCompany: jest.fn(),
    getInvoicesForStudent: jest.fn(),
    deleteInvoice: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [SkillsController],
      providers: [
        SkillsService,
        DocumentTransferService,
        ConfigService,
        NotificationsService,
        CompanyService,
        MissionService,
        StudentService,
        GroupService,
        MailService,
        JobsService,
        StudiesService,
        FileService,
        SkillsService,
        PaymentService,
        {
          provide: InvoiceService,
          useValue: mockInvoiceService,
        },
        AiService,
        {
          provide: getRepositoryToken(Mission),
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
          provide: getRepositoryToken(CompanyPreferences),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentDocument),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentPreferences),
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
          provide: getRepositoryToken(StudentUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentProfile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Notification),
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
          provide: 'MAILER_PROVIDER',
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<SkillsController>(SkillsController);
    service = module.get<SkillsService>(SkillsService);
  });

  describe('getSkillsList', () => {
    it('should return Linker skill list', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const expectedResponse = SkillList;

      // jest.spyOn(service, 'getStudentStats').mockResolvedValueOnce(expectedResponse);

      const response = await controller.getSkillsList(req);

      expect(response).toEqual(expectedResponse);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
