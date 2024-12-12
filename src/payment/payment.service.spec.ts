import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entity/payment.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Mission } from '../mission/entity/mission.entity';
import { CompanyUser } from '../company/entity/CompanyUser.entity';
import { PaymentStatus } from './enum/payment.status.enum';
import { MissionStatus } from '../mission/enum/mission-status.enum';
import { CompanyService } from '../company/company.service';
import { CompanyProfile } from '../company/entity/CompanyProfile.entity';
import { CompanyDocument } from '../company/entity/CompanyDocument.entity';
import { CompanyPreferences } from '../company/entity/CompanyPreferences.entity';
import { DocumentTransferService } from '../document-transfer/src/services/document-transfer.service';
import { ConfigService } from '@nestjs/config';
import { StudentService } from '../student/student.service';
import { StudentDocument } from '../student/entity/StudentDocuments.entity';
import { StudentPreferences } from '../student/entity/StudentPreferences.entity';
import { StudentProfile } from '../student/entity/StudentProfile.entity';
import { Jobs } from '../student/jobs/entity/jobs.entity';
import { Skills } from '../student/skills/entity/skills.entity';
import { Studies } from '../student/studies/entity/studies.entity';
import { StudentUser } from '../student/entity/StudentUser.entity';
import { SkillsService } from '../student/skills/skills.service';
import { JobsService } from '../student/jobs/jobs.service';
import { StudiesService } from '../student/studies/studies.service';
import { FileService } from '../filesystem/file.service';
import { StudentPaymentResponseDto } from './dto/student-payment-response.dto';
import { StudentPaymentStatus } from './enum/student-payment.status.enum';
import { AiService } from '../ai/ai.service';
import { InvoiceService } from '../invoice/invoice.service';
import { MissionService } from '../mission/mission.service';
import { Document } from '../documents/entity/document.entity';
import { StudentPayment } from './entity/student-payment.entity';

describe('PaymentService', () => {
  let service: PaymentService;
  let controller: PaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: {
            createProductAndCheckoutSession: jest.fn(),
            paymentSuccess: jest.fn(),
            getPayment: jest.fn(),
            getStudentPayment: jest.fn(),
            getStudentPaymentById: jest.fn(),
            receiveStudentPayment: jest.fn(),
            createPaymentRow: jest.fn(),
            createStudentPayment: jest.fn(),
          },
        },
        CompanyService,
        StudentService,
        JobsService,
        StudiesService,
        FileService,
        DocumentTransferService,
        ConfigService,
        SkillsService,
        AiService,
        {
          provide: getRepositoryToken(Payment),
          useValue: {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
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
          provide: getRepositoryToken(CompanyDocument),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyPreferences),
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
          provide: getRepositoryToken(StudentUser),
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
          provide: getRepositoryToken(Skills),
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
          provide: getRepositoryToken(Skills),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Document),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentPayment),
          useValue: {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: InvoiceService,
          useValue: {
            generateInvoice: jest.fn(),
            generateInvoiceForCompany: jest.fn(),
            downloadInvoice: jest.fn(),
            getInvoicesForCompany: jest.fn(),
            getInvoicesForStudent: jest.fn(),
            deleteInvoice: jest.fn(),
          },
        },
        {
          provide: MissionService,
          useValue: {
            findMissionById: jest.fn(),
            saveMission: jest.fn(),
            getMissionDetailsCompanyV2: jest.fn(),
            getMissionTasks: jest.fn(),
            findAllByCompanyId: jest.fn(),
          },
        },
        {
          provide: PaymentService,
          useValue: {
            createProductAndCheckoutSession: jest.fn(),
            paymentSuccess: jest.fn(),
            getPayment: jest.fn(),
            getStudentPayment: jest.fn(),
            getStudentPaymentById: jest.fn(),
            receiveStudentPayment: jest.fn(),
          },
        },
      ],
      exports: [PaymentService],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    service = module.get<PaymentService>(PaymentService);
  });

  describe('createProductAndCheckoutSession', () => {
    it('should create product and checkout session', async () => {
      const payment: Payment = {
        id: 1,
        missionId: 1,
        sessionId: 'test',
        status: PaymentStatus.WAITING,
        email: 'test@gmail.com',
        createdAt: new Date(),
        priceId: 'test',
        productId: 'test',
        companyId: 1,
        sessionUrl: 'test',
      };

      const mission: Mission = {
        name: 'Name',
        description: 'Desc',
        startOfMission: null,
        endOfMission: null,
        amount: 100,
        id: 1,
        createdAt: new Date(),
        groupId: null,
        status: MissionStatus.PENDING,
        companyId: 1,
        skills: '',
        comments: null,
        isNoted: false,
        specificationsFile: null,
      };

      const req = {
        user: {
          email: 'test@gmail.com',
        },
      };

      jest
        .spyOn(service, 'createProductAndCheckoutSession')
        .mockResolvedValue(payment);

      const res = await controller.createProductAndCheckoutSession('1', req);

      expect(service.createProductAndCheckoutSession).toHaveBeenCalledWith(
        '1',
        req,
      );
      expect(payment).toEqual(res);
    });
  });

  describe('paymentSuccess', () => {
    it('should return payment success', async () => {
      const payment: Payment = {
        id: 1,
        missionId: 1,
        sessionId: 'test',
        status: PaymentStatus.WAITING,
        email: 'test@gmail.com',
        createdAt: new Date(),
        priceId: 'test',
        productId: 'test',
        companyId: 1,
        sessionUrl: 'test',
      };

      jest
        .spyOn(service, 'paymentSuccess')
        .mockResolvedValue('Payment successful');

      const res = await controller.paymentSuccess('test', '1');

      expect(service.paymentSuccess).toHaveBeenCalledWith('test', '1');

      expect('Payment successful').toEqual(res);
    });
  });

  describe('getPayments', () => {
    it('should get payments', async () => {
      const payment: Payment = {
        id: 1,
        missionId: 1,
        sessionId: 'test',
        status: PaymentStatus.WAITING,
        email: 'test@gmail.com',
        createdAt: new Date(),
        priceId: 'test',
        productId: 'test',
        companyId: 1,
        sessionUrl: 'test',
      };

      const req = {
        user: {
          email: 'test@gmail.com',
        },
      };

      jest.spyOn(service, 'getPayment').mockResolvedValue(payment);

      const res = await controller.getPayments('1', req);

      expect(service.getPayment).toHaveBeenCalledWith('1', req);

      expect(payment).toEqual(res);
    });
  });

  describe('getStudentPaymentsFunc', () => {
    it('should get student payments', async () => {
      const studentPaymentResponseDto: StudentPaymentResponseDto[] = [
        {
          id: 1,
          missionName: 'Test',
          status: StudentPaymentStatus.WAITING,
          amount: 100,
        },
      ];

      const req = {
        user: {
          email: 'test@gmail.com',
        },
      };

      jest
        .spyOn(service, 'getStudentPayment')
        .mockResolvedValue(studentPaymentResponseDto);

      const res = await controller.getStudentPayments(req);

      expect(service.getStudentPayment).toHaveBeenCalledWith(req);

      expect(studentPaymentResponseDto).toEqual(res);
    });
  });

  describe('getStudentPayment', () => {
    it('should get student payment', async () => {
      const studentPaymentResponseDto: StudentPaymentResponseDto = {
        id: 1,
        missionName: 'Test',
        status: StudentPaymentStatus.WAITING,
        amount: 100,
      };

      const req = {
        user: {
          email: 'test@gmail.com',
        },
      };

      jest
        .spyOn(service, 'getStudentPaymentById')
        .mockResolvedValue(studentPaymentResponseDto);

      const res = await controller.getStudentPayment(req, 1);

      expect(service.getStudentPaymentById).toHaveBeenCalledWith(1, req);

      expect(studentPaymentResponseDto).toEqual(res);
    });
  });

  describe('receiveStudentPayment', () => {
    it('should receive student payment', async () => {
      const studentPaymentResponseDto: StudentPaymentResponseDto = {
        id: 1,
        missionName: 'Test',
        status: StudentPaymentStatus.WAITING,
        amount: 100,
      };

      const req = {
        user: {
          email: 'test@gmail.com',
        },
      };

      jest.spyOn(service, 'receiveStudentPayment').mockResolvedValue(undefined);

      const res = await controller.receiveStudentPayment(req, 1);

      expect(service.receiveStudentPayment).toHaveBeenCalledWith(1, req);

      expect(undefined).toEqual(res);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
