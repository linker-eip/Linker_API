import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { CompanyCreateInvoiceDto } from '../company/dto/company-create-invoice.dto';
import { CompanyInvoiceDataDto } from '../company/dto/company-invoice-data.dto';
import { CompanyProfile } from '../company/entity/CompanyProfile.entity';
import { NotFoundException } from '@nestjs/common';
import { MissionService } from '../mission/mission.service';
import { StudentService } from '../student/student.service';
import { Repository } from 'typeorm';
import { FileService } from '../filesystem/file.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Mission } from '../mission/entity/mission.entity';
import { CompanyService } from '../company/company.service';
import { StudentUser } from '../student/entity/StudentUser.entity';
import { StudentProfile } from '../student/entity/StudentProfile.entity';
import { SkillsService } from '../student/skills/skills.service';
import { JobsService } from '../student/jobs/jobs.service';
import { StudiesService } from '../student/studies/studies.service';
import { CompanyUser } from '../company/entity/CompanyUser.entity';
import { Skills } from '../student/skills/entity/skills.entity';
import { Jobs } from '../student/jobs/entity/jobs.entity';
import { Studies } from '../student/studies/entity/studies.entity';
import { Document } from '../documents/entity/document.entity';
import { DocumentTypeEnum } from '../documents/enum/document-type.enum';
import { DocumentUserEnum } from '../documents/enum/document-user.enum';
import { InvoiceController } from './invoice.controller';
import { MissionTask } from '../mission/entity/mission-task.entity';
import { GroupService } from '../group/group.service';
import { MissionInvite } from '../mission/entity/mission-invite.entity';
import { DocumentTransferService } from '../document-transfer/src/services/document-transfer.service';
import { Group } from '../group/entity/Group.entity';
import { GroupInvite } from '../group/entity/GroupInvite.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { ConfigService } from '@nestjs/config';
import { Notification } from '../notifications/entity/Notification.entity';
import { LinkerInvoiceCompanyDto } from './dto/linker-invoice-company.dto';
import { StudentPreferences } from '../student/entity/StudentPreferences.entity';
import { StudentDocument } from '../student/entity/StudentDocuments.entity';
import { CompanyPreferences } from '../company/entity/CompanyPreferences.entity';
import { CompanyDocument } from '../company/entity/CompanyDocument.entity';
import { MailService } from '../mail/mail.service';
import { PaymentService } from '../payment/payment.service';
import { Payment } from '../payment/entity/payment.entity';
import { StudentPayment } from '../payment/entity/student-payment.entity';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let companyProfileRepository: Repository<CompanyProfile>;
  let missionService: MissionService;
  let studentService: StudentService;
  let fileService: FileService;
  let controller: InvoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        InvoiceService,
        MissionService,
        StudentService,
        FileService,
        CompanyService,
        SkillsService,
        JobsService,
        StudiesService,
        FileService,
        GroupService,
        DocumentTransferService,
        NotificationsService,
        ConfigService,
        PaymentService,
        MailService,
        {
          provide: getRepositoryToken(Mission),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyProfile),
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
          provide: getRepositoryToken(Document),
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
          provide: getRepositoryToken(CompanyPreferences),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyDocument),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Skills),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Studies),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Jobs),
          useClass: Repository,
        }, {
          provide: getRepositoryToken(MissionTask),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MissionInvite),
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
        {
          provide: getRepositoryToken(Notification),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Document),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(CompanyProfile),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(CompanyUser),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(StudentUser),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(StudentProfile),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(Skills),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(Jobs),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(Studies),
          useClass: Repository
        },
        {
          provide: InvoiceService,
          useValue: {
            getInvoices: jest.fn(),
            generateInvoice: jest.fn(),
            downloadInvoice: jest.fn(),
            deleteInvoice: jest.fn(),
            generateInvoiceForCompany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    companyProfileRepository = module.get<Repository<CompanyProfile>>(
      'CompanyProfileRepository',
    );
    missionService = module.get<MissionService>(MissionService);
    studentService = module.get<StudentService>(StudentService);
    fileService = module.get<FileService>(FileService);

    controller = module.get<InvoiceController>(InvoiceController);
  });

  describe('getInvoices', () => {
    it('should return an array of invoices', async () => {
      const req = {
        user: {
          email: 'test@gmail.com',
        },
      };

      const document: Document[] = [
        {
          id: 1,
          documentPath: 'test',
          documentType: DocumentTypeEnum.INVOICE,
          documentUser: DocumentUserEnum.COMPANY,
          userId: 1,
          createdAt: new Date(),
        },
        {
          id: 2,
          documentPath: 'test',
          documentType: DocumentTypeEnum.INVOICE,
          documentUser: DocumentUserEnum.COMPANY,
          userId: 1,
          createdAt: new Date(),
        },
      ];

      jest.spyOn(service, 'getInvoices').mockResolvedValueOnce(document);

      const response = await controller.getInvoices(req);

      expect(service.getInvoices).toHaveBeenCalledWith(req.user.email);
      expect(response).toEqual(document);
    });
  });

  describe('generatePdf', () => {
    it('should return a pdf', async () => {
      const req = {
        user: {
          email: 'test@gmail.com',
        },
      };

      const res = {
        status: jest.fn(() => res),
        sendFile: jest.fn(),
        send: jest.fn(),
      };

      const companyCreateInvoiceDto: CompanyCreateInvoiceDto = {
        missionId: 1,
        studentId: 1,
        amount: 100,
        headerFields: [
          'Description',
          'Quantité',
          'Prix Unitaire(HT)',
          'Total(HT)',
        ],
        rows: [
          {
            Description: "Page d'accueil",
            Quantité: 1,
            'Prix Unitaire(HT)': '120 €',
            'Total(HT)': '120 €',
          },
          {
            Description: 'Page formulaire',
            Quantité: 1,
            'Prix Unitaire(HT)': '90 €',
            'Total(HT)': '90 €',
          },
          {
            Description: 'Base de donnée',
            Quantité: 1,
            'Prix Unitaire(HT)': '140 €',
            'Total(HT)': '140 €',
          },
        ],
      };

      const document: Document = {
        id: 1,
        documentPath: 'test',
        documentType: DocumentTypeEnum.INVOICE,
        documentUser: DocumentUserEnum.COMPANY,
        userId: 1,
        createdAt: new Date(),
      };

      jest.spyOn(service, 'generateInvoice').mockResolvedValueOnce();

      const response = await controller.generatePdf(
        res,
        req,
        companyCreateInvoiceDto,
      );

      expect(service.generateInvoice).toHaveBeenCalledWith(
        req.user.email,
        companyCreateInvoiceDto,
      );
      expect(response).toEqual(undefined);
    });
  });

  describe('getInvoice', () => {
    it('should return an invoice', async () => {
      const res = {
        status: jest.fn(() => res),
        sendFile: jest.fn(),
        send: jest.fn(),
      };

      const req = {
        user: {
          email: 'test@gmail.com',
        },
      };

      const document: Document = {
        id: 1,
        documentPath: 'test',
        documentType: DocumentTypeEnum.INVOICE,
        documentUser: DocumentUserEnum.COMPANY,
        userId: 1,
        createdAt: new Date(),
      };

      jest.spyOn(service, 'downloadInvoice').mockResolvedValueOnce(res);

      const response = await controller.getInvoice(1, res);

      expect(service.downloadInvoice).toHaveBeenCalledWith(1, res);
      expect(response).toEqual(response);
    });
  });

  describe('deleteInvoice', () => {
    it('should delete an invoice', async () => {
      const document: Document = {
        id: 1,
        documentPath: 'test',
        documentType: DocumentTypeEnum.INVOICE,
        documentUser: DocumentUserEnum.COMPANY,
        userId: 1,
        createdAt: new Date(),
      };

      const req = {
        user: {
          email: 'tony@gmail.com',
        },
      };

      jest.spyOn(service, 'deleteInvoice').mockResolvedValueOnce(true);

      const response = await controller.deleteInvoice(1);

      expect(service.deleteInvoice).toHaveBeenCalledWith(1);
      expect(response).toEqual(true);
    });
  });

  describe('generateCompanyPdf', () => {
    it('should return a pdf', async () => {
      const req = {
        user: {
          email: 'tony@gmail.com',
        },
      };

      const res = {
        status: jest.fn(() => res),
        sendFile: jest.fn(),
        send: jest.fn(),
      };

      const linkerInvoiceCompanyDto: LinkerInvoiceCompanyDto = {
        missionId: 1,
        companyId: 1,
        amount: 100,
        headerFields: [
          'Description',
          'Quantité',
          'Prix Unitaire(HT)',
          'Total(HT)',
        ],
        rows: [
          {
            Description: "Page d'accueil",
            Quantité: 1,
            'Prix Unitaire(HT)': '120 €',
            'Total(HT)': '120 €',
          },
          {
            Description: 'Page formulaire',
            Quantité: 1,
            'Prix Unitaire(HT)': '90 €',
            'Total(HT)': '90 €',
          },
          {
            Description: 'Base de donnée',
            Quantité: 1,
            'Prix Unitaire(HT)': '140 €',
            'Total(HT)': '140 €',
          },
        ],
        companyEmail: 'company@gmail.com',
      };

      const document: Document = {
        id: 1,
        documentPath: 'test',
        documentType: DocumentTypeEnum.INVOICE,
        documentUser: DocumentUserEnum.COMPANY,
        userId: 1,
        createdAt: new Date(),
      };

      jest.spyOn(service, 'generateInvoiceForCompany').mockResolvedValueOnce();

      const response = await controller.generateCompanyPdf(
        res,
        req,
        linkerInvoiceCompanyDto,
      );

      expect(service.generateInvoiceForCompany).toHaveBeenCalledWith(
        linkerInvoiceCompanyDto,
      );

      expect(response).toEqual(undefined);

      expect(response).toEqual(undefined);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
