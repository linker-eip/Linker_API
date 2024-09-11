import { Test, TestingModule } from '@nestjs/testing';
import { AuthAdminController } from './auth.admin.controller';
import { AuthAdminService } from './auth.admin.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdminUser } from '../entity/AdminUser.entity';
import { Repository } from 'typeorm';
import { AdminService } from '../admin.service';
import { LoginAdminResponseDto } from './dto/login-admin-response.dto';
import { LoginAminDto } from './dto/login-admin.dto';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { CompanyUser } from '../../company/entity/CompanyUser.entity';
import { NotificationsService } from '../../notifications/notifications.service';
import { Notification } from '../../notifications/entity/Notification.entity';
import { StudentPreferences } from '../../student/entity/StudentPreferences.entity';
import { CompanyPreferences } from '../../company/entity/CompanyPreferences.entity';
import { StudentService } from '../../student/student.service';
import { MailService } from '../../mail/mail.service';
import { CompanyService } from '../../company/company.service';
import { AuthService } from '../../auth/auth.service';
import { AiService } from '../../ai/ai.service';
import { GoogleApiService } from '../../auth/services/google-api-services';
import { SkillsService } from '../../student/skills/skills.service';
import { JobsService } from '../../student/jobs/jobs.service';
import { GroupService } from '../../group/group.service';
import { MissionService } from '../../mission/mission.service';
import { StudiesService } from '../../student/studies/studies.service';
import { FileService } from '../../filesystem/file.service';
import { SiretService } from '../../siret/siret.service';
import { DocumentTransferService } from '../../document-transfer/src/services/document-transfer.service';
import { PaymentService } from '../../payment/payment.service';
import { ConfigService } from '@nestjs/config';
import { StudentProfile } from '../../student/entity/StudentProfile.entity';
import { CompanyProfile } from '../../company/entity/CompanyProfile.entity';
import { Skills } from '../../student/skills/entity/skills.entity';
import { Jobs } from '../../student/jobs/entity/jobs.entity';
import { Group } from '../../group/entity/Group.entity';
import { MissionInvite } from '../../mission/entity/mission-invite.entity';
import { Payment } from '../../payment/entity/payment.entity';
import { StudentPayment } from '../../payment/entity/student-payment.entity';
import { MissionTask } from '../../mission/entity/mission-task.entity';
import { GroupInvite } from '../../group/entity/GroupInvite.entity';
import { Mission } from '../../mission/entity/mission.entity';
import { Studies } from '../../student/studies/entity/studies.entity';
import { StudentDocument } from '../../student/entity/StudentDocuments.entity';
import { CompanyDocument } from '../../company/entity/CompanyDocument.entity';

describe('AuthAdminService', () => {
  let service: AuthAdminService;
  let controller: AuthAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [AuthAdminController],
      providers: [
        AuthAdminService,
        AuthService,
        AdminService,
        StudentService,
        JwtService,
        CompanyService,
        AiService,
        MailService,
        GoogleApiService,
        SkillsService,
        JobsService,
        GroupService,
        MissionService,
        StudiesService,
        FileService,
        SiretService,
        NotificationsService,
        DocumentTransferService,
        PaymentService,
        ConfigService,
        {
          provide: getRepositoryToken(StudentUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentProfile),
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
          provide: getRepositoryToken(Skills),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Jobs),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Group),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Notification),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MissionInvite),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Payment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AdminUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentPayment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MissionTask),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(GroupInvite),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Mission),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Studies),
          useClass: Repository,
        },
        {
          provide: 'MAILER_PROVIDER',
          useValue: 'GMAIL',
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
      ],
    }).compile();

    controller = module.get<AuthAdminController>(AuthAdminController);
    service = module.get<AuthAdminService>(AuthAdminService);
  });

  describe('login', () => {
    it('should return a token', async () => {
      const loginAdminDto: LoginAminDto = {
        email: 'tonybano83@gmail.com',
        password: 'Azerty1234!',
      };
      const result: LoginAdminResponseDto = {
        token: 'token',
      };
      jest.spyOn(service, 'loginAdmin').mockImplementation(async () => result);

      const response = await controller.loginAdmin(loginAdminDto);

      expect(service.loginAdmin).toHaveBeenCalledWith(loginAdminDto);
      expect(response).toBe(result);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
