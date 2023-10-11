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

describe('AuthService', () => {
  let service: AuthService;
  let controller: AuthController

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
      providers: [AuthService, StudentService, JwtService, CompanyService, MailService, GoogleApiService, SkillsService, JobsService, StudiesService, FileService,
        {
          provide: getRepositoryToken(StudentUser),
          useClass: Repository,
        }, {
          provide: getRepositoryToken(StudentProfile),
          useClass: Repository
        }, {
          provide: getRepositoryToken(CompanyUser),
          useClass: Repository
        }, {
          provide: getRepositoryToken(CompanyProfile),
          useClass: Repository
        }, {
          provide: getRepositoryToken(Skills),
          useClass: Repository
        }, {
          provide: getRepositoryToken(Jobs),
          useClass: Repository
        }, {
          provide: getRepositoryToken(Studies),
          useClass: Repository
        }, {
          provide: "MAILER_PROVIDER",
          useValue: "GMAIL"
        }],
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

      jest.spyOn(service, 'registerStudent').mockResolvedValueOnce(expectedStudent);

      const response = await service.registerStudent(registerStudentDto);

      expect(service.registerStudent).toHaveBeenCalledWith(registerStudentDto);
      expect(response).toEqual(expectedStudent);
    });
  });

  describe('GET /userType', () => {
    it('should return the user type', async () => {
      const req = { user: { userType: 'exampleType' } };
      expect(await controller.getUserType(req)).toBe('exampleType');
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

