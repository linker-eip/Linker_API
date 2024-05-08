import { Test, TestingModule } from "@nestjs/testing";
import { PaymentAdminController } from "./payment-admin.controller";
import { PaymentAdminService } from "./payment-admin.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { StudentPayment } from "../../payment/entity/student-payment.entity";
import { Repository } from "typeorm";
import { StudentPaymentStatus } from "../../payment/enum/student-payment.status.enum copy";
import { StudentPaymentResponseDto } from "./dto/student-payment-response.dto";
import { UserAdminService } from "../user-admin/user-admin.service";
import { MissionService } from "../mission/mission.service";
import { StudentUser } from "../../student/entity/StudentUser.entity";
import { StudentProfile } from "../../student/entity/StudentProfile.entity";
import { CompanyUser } from "../../company/entity/CompanyUser.entity";
import { CompanyProfile } from "../../company/entity/CompanyProfile.entity";
import { Mission } from "../../mission/entity/mission.entity";


describe('PaymentAdminService', () => {
  let service: PaymentAdminService;
  let controller: PaymentAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [PaymentAdminController],
      providers: [
        PaymentAdminService,
        UserAdminService,
        MissionService,
        {
          provide: getRepositoryToken(StudentPayment),
          useClass: Repository,
        }, {
          provide: getRepositoryToken(StudentUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentProfile),
          useClass: Repository,
        },        {
          provide: getRepositoryToken(CompanyUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyProfile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Mission),
          useClass: Repository,
        },
        
      ],
      exports: [PaymentAdminService],
    }).compile();

    controller = module.get<PaymentAdminController>(PaymentAdminController);
    service = module.get<PaymentAdminService>(PaymentAdminService);
  });

  describe('get student payments', () => {
    it('should get all student payments', async () => {
      const studentPayments: StudentPaymentResponseDto[] = [
        {
          id: 1,
          mission: {
            id: 1,
            name: 'mission',
            status: 'active',
            description: 'description',
            startOfMission: new Date(),
            endOfMission: new Date(),
            amount: 100,
            numberOfStudents: 1,
            company: {
              id: 1,
              email: 'company1@gmail.com',
              companyName: 'company1',
              phoneNumber: '1234567890',
              picture: 'picture',
              companyPicture: 'companyPicture',
              isActive: true,
              lastConnectedAt: new Date(),
              createdAt: new Date(),
            },
          },
          status: StudentPaymentStatus.PENDING,
          student: {
            id: 1,
            email: 'student1@gmail.com',
            FirstName: 'student1',
            LastName: 'student1',
            picture: 'picture',
            isActive: true,
            lastConnectedAt: new Date(),
            createdAt: new Date(),
          },
          amount: 100,
        },
      ];
      jest.spyOn(service, 'getStudentPayments').mockResolvedValue(studentPayments);

      const res = await controller.getStudentPayments();

      expect(service.getStudentPayments).toHaveBeenCalled();

      expect(studentPayments).toEqual(res);
    });
  });


  describe('update student payment', () => {
    it('should update a student payment', async () => {
      const updateStudentPaymentDto = {
        id: 1,
        status: StudentPaymentStatus.PENDING,
      };

      const studentPayment: StudentPaymentResponseDto = {
        id: 1,
        mission: {
          id: 1,
          name: 'mission',
          status: 'active',
          description: 'description',
          startOfMission: new Date(),
          endOfMission: new Date(),
          amount: 100,
          numberOfStudents: 1,
          company: {
            id: 1,
            email: 'company1@gmail.com',
            companyName: 'company1',
            phoneNumber: '1234567890',
            picture: 'picture',
            companyPicture: 'companyPicture',
            isActive: true,
            lastConnectedAt: new Date(),
            createdAt: new Date(),
          },
        },
        status: StudentPaymentStatus.PENDING,
        student: {
          id: 1,
          email: 'student1@gmail.com',
          FirstName: 'student1',
          LastName: 'student1',
          picture: 'picture',
          isActive: true,
          lastConnectedAt: new Date(),
          createdAt: new Date(),
        },
        amount: 100,
      };

      jest.spyOn(service, 'updateStudentPayment').mockResolvedValue(studentPayment);

      const res = await controller.updateStudentPayment(updateStudentPaymentDto);

      expect(service.updateStudentPayment).toHaveBeenCalled();

      expect(studentPayment).toEqual(res);
    }
    );
  }
  );

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});