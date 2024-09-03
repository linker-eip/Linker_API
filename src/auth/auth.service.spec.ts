import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { StudentService } from '../student/student.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CompanyService } from '../company/company.service';
import { MailService } from '../mail/mail.service';
import { GoogleApiService } from './services/google-api-services';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StudentUser } from '../student/entity/StudentUser.entity';
import { Repository } from 'typeorm';
import { StudentProfile } from '../student/entity/StudentProfile.entity';
import { CompanyUser } from '../company/entity/CompanyUser.entity';
import { CompanyProfile } from '../company/entity/CompanyProfile.entity';
import { SkillsService } from '../student/skills/skills.service';
import { JobsService } from '../student/jobs/jobs.service';
import { StudiesService } from '../student/studies/studies.service';
import { FileService } from '../filesystem/file.service';
import { Skills } from '../student/skills/entity/skills.entity';
import { Jobs } from '../student/jobs/entity/jobs.entity';
import { Studies } from '../student/studies/entity/studies.entity';
import { RegisterStudentDto } from './dto/register-student.dto';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import {
  RegisterCompanyDto,
  RegisterCompanyV2Dto,
} from './dto/register-company.dto';
import { LoginStudentDto } from './dto/login-student.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LoginCompanyDto } from './dto/login-company.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GoogleLoginDto, GoogleLoginTokenDto } from './dto/google-login.dto';
import { SiretService } from '../siret/siret.service';
import { DocumentTransferService } from '../document-transfer/src/services/document-transfer.service';
import { ConfigService } from '@nestjs/config';
import { StudentPreferences } from '../student/entity/StudentPreferences.entity';
import { CompanyPreferences } from '../company/entity/CompanyPreferences.entity';
import { GroupService } from '../group/group.service';
import { MissionService } from '../mission/mission.service';
import { StudentDocument } from '../student/entity/StudentDocuments.entity';
import { CompanyDocument } from '../company/entity/CompanyDocument.entity';
import { Group } from '../group/entity/Group.entity';
import { GroupModule } from '../group/group.module';
import { GroupInvite } from '../group/entity/GroupInvite.entity';
import { Mission } from '../mission/entity/mission.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { MissionTask } from '../mission/entity/mission-task.entity';
import { MissionInvite } from '../mission/entity/mission-invite.entity';
import { Notification } from '../notifications/entity/Notification.entity';
import { PaymentService } from '../payment/payment.service';
import { Payment } from '../payment/entity/payment.entity';
import { StudentPayment } from '../payment/entity/student-payment.entity';

describe('AuthService', () => {
  let service: AuthService;
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        StudentService,
        JwtService,
        CompanyService,
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
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('registerStudent', () => {
    it('should return a student', async () => {
      const registerStudentDto: RegisterStudentDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      const expectedStudent = {
        token: 'token',
      };

      jest
        .spyOn(service, 'registerStudent')
        .mockResolvedValueOnce(expectedStudent);

      const response = await controller.registerStudent(registerStudentDto);

      expect(service.registerStudent).toHaveBeenCalledWith(registerStudentDto);
      expect(response).toEqual(expectedStudent);
    });
  });

  describe('loginStudent', () => {
    it('should return a student', async () => {
      const loginStudentDto: LoginStudentDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const expectedStudent = {
        token: 'token',
      };

      jest
        .spyOn(service, 'loginStudent')
        .mockResolvedValueOnce(expectedStudent);

      const response = await controller.loginStudent(loginStudentDto);

      expect(service.loginStudent).toHaveBeenCalledWith(loginStudentDto);
      expect(response).toEqual(expectedStudent);
    });
  });

  describe('loginStudentWrongPassword', () => {
    it('shouldnt return a student', async () => {
      const loginStudentDto: LoginStudentDto = {
        email: 'test@example.com',
        password: 'Password321!',
      };

      const expectedStudent = null;

      const expectedResponse = {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Mot de passe incorrect',
      };

      jest
        .spyOn(service, 'loginStudent')
        .mockResolvedValueOnce(expectedStudent);

      await expect(async () =>
        controller.loginStudent(loginStudentDto),
      ).rejects.toThrow('Mot de passe incorrect');
      expect(service.loginStudent).toHaveBeenCalledWith(loginStudentDto);
    });
  });

  describe('GET /userType', () => {
    it('should return the user type', async () => {
      const req = { user: { userType: 'exampleType' } };
      expect(await controller.getUserType(req)).toBe('exampleType');
    });
  });

  describe('registerCompany', () => {
    it('should return a company', async () => {
      const registerCompanyDto: RegisterCompanyDto = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Company Name',
        phoneNumber: '0612345678',
      };

      const expectedCompany = {
        token: 'token',
      };

      jest
        .spyOn(service, 'registerCompany')
        .mockResolvedValueOnce(expectedCompany);

      const response = await controller.registerCompany(registerCompanyDto);

      expect(service.registerCompany).toHaveBeenCalledWith(registerCompanyDto);
      expect(response).toEqual(expectedCompany);
    });
  });

  describe('registerCompanyv2', () => {
    it('should return a company', async () => {
      const registerCompanyDto: RegisterCompanyV2Dto = {
        email: 'test@example.com',
        password: 'Password123!',
        siret: '97788133300016',
        phoneNumber: '0612345678',
      };

      const expectedCompany = {
        token: 'token',
      };

      jest
        .spyOn(service, 'registerCompanyv2')
        .mockResolvedValueOnce(expectedCompany);

      const response = await controller.registerCompanyv2(registerCompanyDto);

      expect(service.registerCompanyv2).toHaveBeenCalledWith(
        registerCompanyDto,
      );
      expect(response).toEqual(expectedCompany);
    });
  });

  describe('loginCompany', () => {
    it('should return a company', async () => {
      const loginCompanyDto: LoginCompanyDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const expectedCompany = {
        token: 'token',
      };

      jest
        .spyOn(service, 'loginCompany')
        .mockResolvedValueOnce(expectedCompany);

      const response = await controller.loginCompany(loginCompanyDto);

      expect(service.loginCompany).toHaveBeenCalledWith(loginCompanyDto);
      expect(response).toEqual(expectedCompany);
    });
  });

  describe('loginCompanyWrongPassword', () => {
    it('shouldnt return a company', async () => {
      const loginCompanyDto: LoginCompanyDto = {
        email: 'test@example.com',
        password: 'Password321!',
      };

      const expectedCompany = null;

      const expectedResponse = {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Mot de passe incorrect',
      };

      jest
        .spyOn(service, 'loginCompany')
        .mockResolvedValueOnce(expectedCompany);

      await expect(async () =>
        controller.loginCompany(loginCompanyDto),
      ).rejects.toThrow('Mot de passe incorrect');
      expect(service.loginCompany).toHaveBeenCalledWith(loginCompanyDto);
    });
  });

  describe('forgotPasswordStudent', () => {
    it('should return a reset token', async () => {
      const forgetPasswordDto: ForgetPasswordDto = {
        email: 'test@example.com',
      };

      const expectedToken = { token: 'token' };

      jest
        .spyOn(service, 'generateStudentResetPassword')
        .mockResolvedValueOnce(null);

      const response = await controller.forgotPasswordStudent(
        forgetPasswordDto,
      );

      expect(service.generateStudentResetPassword).toHaveBeenCalledWith(
        forgetPasswordDto,
      );
    });
  });

  describe('forgotPasswordCompany', () => {
    it('should return a reset token', async () => {
      const forgetPasswordDto: ForgetPasswordDto = {
        email: 'test@example.com',
      };

      const expectedToken = { token: 'token' };

      jest
        .spyOn(service, 'generateCompanyResetPassword')
        .mockResolvedValueOnce(null);

      const response = await controller.forgotPassword(forgetPasswordDto);

      expect(service.generateCompanyResetPassword).toHaveBeenCalledWith(
        forgetPasswordDto,
      );
      //  expect(response).toEqual(expectedToken)
    });
  });

  describe('resetPasswordStudent', () => {
    it('should return a message', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        token: 'token',
        password: 'newPassword123!',
      };

      const expectedMessage = {
        message: 'Mot de passe rénitialisé avec succès',
      };

      jest
        .spyOn(service, 'resetStudentPassword')
        .mockResolvedValueOnce(expectedMessage);

      const response = await controller.resetPasswordStudent(resetPasswordDto);

      expect(service.resetStudentPassword).toHaveBeenCalledWith(
        resetPasswordDto,
      );
      expect(response).toEqual(expectedMessage);
    });
  });

  describe('resetPasswordCompany', () => {
    it('should return a message', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        token: 'token',
        password: 'newPassword123!',
      };

      const expectedMessage = {
        message: 'Mot de passe rénitialisé avec succès',
      };

      jest
        .spyOn(service, 'resetCompanyPassword')
        .mockResolvedValueOnce(expectedMessage);

      const response = await controller.resetPassword(resetPasswordDto);

      expect(service.resetCompanyPassword).toHaveBeenCalledWith(
        resetPasswordDto,
      );
      expect(response).toEqual(expectedMessage);
    });
  });

  describe('studentGoogleCode', () => {
    it('should return a token', async () => {
      const googleLoginDto: GoogleLoginDto = {
        code: 'code',
      };

      const expectedToken = { token: 'token' };

      jest
        .spyOn(service, 'googleStudentLoginWithCode')
        .mockResolvedValueOnce(expectedToken);

      const response = await controller.googleLoginWithCode(googleLoginDto);

      expect(service.googleStudentLoginWithCode).toHaveBeenCalledWith(
        googleLoginDto,
      );
      expect(response).toEqual(expectedToken);
    });
  });

  describe('studentGoogleCodeError', () => {
    it('shouldnt return a token', async () => {
      const googleLoginDto: GoogleLoginDto = {
        code: null,
      };

      await expect(async () =>
        controller.googleLoginWithCode(googleLoginDto),
      ).rejects.toThrow();
    });
  });

  describe('companyGoogleCodeError', () => {
    it('shouldnt return a token', async () => {
      const googleLoginDto: GoogleLoginDto = {
        code: null,
      };

      await expect(async () =>
        controller.googleCompanyLoginWithCode(googleLoginDto),
      ).rejects.toThrow();
    });
  });

  describe('companyGoogleCode', () => {
    it('should return a token', async () => {
      const googleLoginDto: GoogleLoginDto = {
        code: 'code',
      };

      const expectedToken = { token: 'token' };

      jest
        .spyOn(service, 'googleCompanyLoginWithCode')
        .mockResolvedValueOnce(expectedToken);

      const response = await controller.googleCompanyLoginWithCode(
        googleLoginDto,
      );

      expect(service.googleCompanyLoginWithCode).toHaveBeenCalledWith(
        googleLoginDto,
      );
      expect(response).toEqual(expectedToken);
    });
  });

  describe('studentGoogleToken', () => {
    it('should return a token', async () => {
      const googleLoginDto: GoogleLoginTokenDto = {
        token: 'token',
      };

      const expectedToken = { token: 'token' };

      jest
        .spyOn(service, 'googleStudentLoginWithToken')
        .mockResolvedValueOnce(expectedToken);

      const response = await controller.googleLoginWithToken(googleLoginDto);

      expect(service.googleStudentLoginWithToken).toHaveBeenCalledWith(
        googleLoginDto,
      );
      expect(response).toEqual(expectedToken);
    });
  });

  describe('companyGoogleToken', () => {
    it('should return a token', async () => {
      const googleLoginDto: GoogleLoginTokenDto = {
        token: 'token',
      };

      const expectedToken = { token: 'token' };

      jest
        .spyOn(service, 'googleCompanyLoginWithToken')
        .mockResolvedValueOnce(expectedToken);

      const response = await controller.googleCompanyLoginWithToken(
        googleLoginDto,
      );

      expect(service.googleCompanyLoginWithToken).toHaveBeenCalledWith(
        googleLoginDto,
      );
      expect(response).toEqual(expectedToken);
    });
  });

  describe('studentGoogleTokenError', () => {
    it('shouldnt return a token', async () => {
      const googleLoginDto: GoogleLoginTokenDto = {
        token: null,
      };

      await expect(async () =>
        controller.googleLoginWithToken(googleLoginDto),
      ).rejects.toThrow();
    });
  });

  describe('companyGoogleTokenError', () => {
    it('shouldnt return a token', async () => {
      const googleLoginDto: GoogleLoginTokenDto = {
        token: null,
      };

      await expect(async () =>
        controller.googleCompanyLoginWithToken(googleLoginDto),
      ).rejects.toThrow();
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
