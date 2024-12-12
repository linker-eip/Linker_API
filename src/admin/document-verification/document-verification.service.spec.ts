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
import { DocumentVerificationService } from './document-verification.service';
import { DocumentVerificationController } from './document-verification.controller';
import {
  DocumentStatus,
  StudentDocumentType,
} from '../../student/enum/StudentDocument.enum';
import { CompanyDocumentType } from '../../company/enum/CompanyDocument.enum';
import { Payment } from '../../payment/entity/payment.entity';
import { StudentPayment } from '../../payment/entity/student-payment.entity';
import { PaymentService } from '../../payment/payment.service';
import { AiService } from '../../ai/ai.service';
import { InvoiceService } from '../../invoice/invoice.service';

describe('DocumentVerificationService', () => {
  let service: DocumentVerificationService;
  let controller: DocumentVerificationController;

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
      controllers: [DocumentVerificationController],
      providers: [
        DocumentVerificationService,
        DocumentTransferService,
        ConfigService,
        NotificationsService,
        PaymentService,
        CompanyService,
        MissionService,
        StudentService,
        GroupService,
        MailService,
        JobsService,
        StudiesService,
        FileService,
        SkillsService,
        AiService,
        {
          provide: InvoiceService,
          useValue: mockInvoiceService,
        },
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
          provide: getRepositoryToken(Payment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentPayment),
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

    controller = module.get<DocumentVerificationController>(
      DocumentVerificationController,
    );
    service = module.get<DocumentVerificationService>(
      DocumentVerificationService,
    );
  });

  describe('getStudentsDocs', () => {
    it('should return all students docs', async () => {
      const req = {
        user: {
          email: 'admin@example.com',
        },
      };

      const expectedResponse = {
        studentId: 1,
        documentType: StudentDocumentType.CNI,
        file: 'mocked/path/to/file',
        status: DocumentStatus.PENDING,
        comment: null,
      };

      jest
        .spyOn(service, 'getAllDocumentsStudent')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.getAllDocuments();

      expect(service.getAllDocumentsStudent).toHaveBeenCalledWith();
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('getCompanyDocs', () => {
    it('should return all companies docs', async () => {
      const req = {
        user: {
          email: 'admin@example.com',
        },
      };

      const expectedResponse = {
        companyId: 1,
        documentType: CompanyDocumentType.KBIS,
        file: 'mocked/path/to/file',
        status: DocumentStatus.PENDING,
        comment: 'KBIS expiré',
      };

      jest
        .spyOn(service, 'getAllDocumentsCompany')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.getAllDocumentsCompany();

      expect(service.getAllDocumentsCompany).toHaveBeenCalledWith();
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('validateStudentDocument', () => {
    it('should validate a student document', async () => {
      const req = {
        user: {
          email: 'admin@example.com',
        },
      };

      const dto = {
        studentId: 1,
        documentType: StudentDocumentType.CNI,
      };

      const expectedResponse = {
        studentId: 1,
        documentType: StudentDocumentType.CNI,
        file: 'mocked/path/to/file',
        status: DocumentStatus.VERIFIED,
        comment: null,
      };

      jest.spyOn(service, 'validateDocumentStudent').mockResolvedValueOnce();
      jest
        .spyOn(service, 'getAllDocumentsStudent')
        .mockResolvedValueOnce(expectedResponse);

      await controller.validateDocumentStudent(dto);
      const response = await controller.getAllDocuments();
      expect(service.validateDocumentStudent).toHaveBeenCalledWith(dto);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('denyStudentDocument', () => {
    it('should deny a student document', async () => {
      const req = {
        user: {
          email: 'admin@example.com',
        },
      };

      const dto = {
        studentId: 1,
        documentType: StudentDocumentType.CNI,
        comment: 'CNI expirée',
      };

      const expectedResponse = {
        studentId: 1,
        documentType: StudentDocumentType.CNI,
        file: 'mocked/path/to/file',
        status: DocumentStatus.DENIED,
        comment: 'CNI expirée',
      };

      jest.spyOn(service, 'denyDocumentStudent').mockResolvedValueOnce();
      jest
        .spyOn(service, 'getAllDocumentsStudent')
        .mockResolvedValueOnce(expectedResponse);

      await controller.denyDocumentStudent(dto);
      const response = await controller.getAllDocuments();
      expect(service.denyDocumentStudent).toHaveBeenCalledWith(dto);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('validateCompanyDocument', () => {
    it('should validate a company document', async () => {
      const req = {
        user: {
          email: 'admin@example.com',
        },
      };

      const dto = {
        companyId: 1,
        documentType: CompanyDocumentType.KBIS,
      };

      const expectedResponse = {
        companyId: 1,
        documentType: CompanyDocumentType.KBIS,
        file: 'mocked/path/to/file',
        status: DocumentStatus.VERIFIED,
        comment: null,
      };

      jest.spyOn(service, 'validateDocumentCompany').mockResolvedValueOnce();
      jest
        .spyOn(service, 'getAllDocumentsCompany')
        .mockResolvedValueOnce(expectedResponse);

      await controller.validateDocumentCompany(dto);
      const response = await controller.getAllDocumentsCompany();
      expect(service.validateDocumentCompany).toHaveBeenCalledWith(dto);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('denyCompanyDocument', () => {
    it('should deny a company document', async () => {
      const req = {
        user: {
          email: 'admin@example.com',
        },
      };

      const dto = {
        companyId: 1,
        documentType: CompanyDocumentType.KBIS,
        comment: 'KBIS expiré',
      };

      const expectedResponse = {
        companyId: 1,
        documentType: CompanyDocumentType.KBIS,
        file: 'mocked/path/to/file',
        status: DocumentStatus.DENIED,
        comment: 'KBIS expiré',
      };

      jest.spyOn(service, 'denyDocumentCompany').mockResolvedValueOnce();
      jest
        .spyOn(service, 'getAllDocumentsCompany')
        .mockResolvedValueOnce(expectedResponse);

      await controller.denyDocumentCompany(dto);
      const response = await controller.getAllDocumentsCompany();
      expect(service.denyDocumentCompany).toHaveBeenCalledWith(dto);
      expect(response).toEqual(expectedResponse);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
