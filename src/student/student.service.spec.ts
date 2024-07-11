import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { FileService } from '../filesystem/file.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StudentUser } from './entity/StudentUser.entity';
import { Repository } from 'typeorm';
import { StudentProfile } from './entity/StudentProfile.entity';
import { SkillsService } from './skills/skills.service';
import { JobsService } from './jobs/jobs.service';
import { StudiesService } from './studies/studies.service';
import { Skills } from './skills/entity/skills.entity';
import { Jobs } from './jobs/entity/jobs.entity';
import { Studies } from './studies/entity/studies.entity';
import { Request } from 'express';
import { StudentProfileResponseDto } from './dto/student-profile-response.dto';
import { DocumentTransferService } from '../document-transfer/src/services/document-transfer.service';
import { CompanyService } from '../company/company.service';
import { ConfigService } from '@nestjs/config';
import { CompanyUser } from '../company/entity/CompanyUser.entity';
import { CompanyProfile } from '../company/entity/CompanyProfile.entity';
import { StudentSearchOptionDto } from './dto/student-search-option.dto';
import { UpdateSkillDto } from './skills/dto/update-skill.dto';
import { UpdateJobsDto } from './jobs/dto/update-jobs.dto';
import { UpdateStudiesDto } from './studies/dto/update-studies.dto';
import { StudentPreferences } from './entity/StudentPreferences.entity';
import { StudentDocument } from './entity/StudentDocuments.entity';
import { CompanyDocument } from '../company/entity/CompanyDocument.entity';
import { CompanyPreferences } from '../company/entity/CompanyPreferences.entity';
import { DocumentStatus, StudentDocumentType } from './enum/StudentDocument.enum';

describe('StudentService', () => {
  let service: StudentService;
  let controller: StudentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [StudentController],
      providers: [
        StudentService,
        FileService,
        SkillsService,
        JobsService,
        StudiesService,
        DocumentTransferService,
        CompanyService,
        ConfigService,
        {
          provide: getRepositoryToken(StudentUser),
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
          provide: getRepositoryToken(CompanyDocument),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyPreferences),
          useClass: Repository,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<StudentController>(StudentController);
    service = module.get<StudentService>(StudentService);
  });

  describe('getStudentProfile', () => {
    it('should return a studentProfile', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const expectedProfile = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        description: "I'm John Doe",
        email: 'test@example.com',
        phone: '0612345678',
        location: 'Marseille',
        picture: '',
        studies: [],
        skills: null,
        jobs: [],
        website: 'http://example.com',
        note: 0,
        noteNumber: 0,
        tjm: 0,
      };

      jest
        .spyOn(service, 'findStudentProfile')
        .mockResolvedValueOnce(expectedProfile);

      const response = await controller.getStudentProfile(req);

      expect(service.findStudentProfile).toHaveBeenCalledWith(req.user.email);
      expect(response).toEqual(expectedProfile);
    });
  });

  describe('updateStudentProfile', () => {
    it('should return a studentProfile', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const newProfile = {
        location: 'Paris',
        phone: '0612345678',
        lastName: 'Doe',
        firstName: 'John',
        picture: null,
        email: 'test@example.com',
        website: 'http://example.com',
        description: 'New Description',
        tjm: 0,
      };

      const expectedProfile = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        description: 'New Description',
        email: 'test@example.com',
        phone: '0612345678',
        location: 'Paris',
        picture: '',
        studies: [],
        skills: null,
        jobs: [],
        website: 'http://example.com',
        note: 0,
        studentId: 0,
        student: null,
        noteNumber: 0,
        tjm: 0,
      };

      jest
        .spyOn(service, 'updateStudentProfile')
        .mockResolvedValueOnce(expectedProfile);

      const response = await controller.updateStudentProfile(
        null,
        req,
        newProfile,
      );

      expect(response).toEqual(expectedProfile);
    });
  });

  describe('updateSkills', () => {
    it('should return a studentProfile', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const dto = new UpdateSkillDto();

      const expectedResponse = null;

      jest
        .spyOn(service, 'updateSkill')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.updateSkill(1, dto, req);
    });
  });

  describe('updateJobs', () => {
    it('should return a studentProfile', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const dto = new UpdateJobsDto();

      const expectedResponse = null;

      jest.spyOn(service, 'updateJob').mockResolvedValueOnce(expectedResponse);

      const response = await controller.updateJob(1, dto, req);

    });
  });

  describe('updateStudies', () => {
    it('should return a studentProfile', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const dto = new UpdateStudiesDto();

      const expectedResponse = null;

      jest
        .spyOn(service, 'updateStudies')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.updateStudies(1, dto, req);

    });
  });

  describe('deleteSkill', () => {
    it('should return a studentProfile', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'deleteSkill')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.deleteSkill(req, 1);

    });
  });

  describe('deleteJob', () => {
    it('should return a studentProfile', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const expectedResponse = null;

      jest.spyOn(service, 'deleteJob').mockResolvedValueOnce(expectedResponse);

      const response = await controller.deleteJob(req, 1);

    });
  });

  describe('deleteStudies', () => {
    it('should return a studentProfile', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'deleteStudies')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.deleteStudies(req, 1);

    });
  });

  describe('findAllStudents', () => {
    it('should return a studentProfile', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const dto = new StudentSearchOptionDto();

      const expectedResponse = null;

      jest
        .spyOn(service, 'findAllStudents')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.findAllStudents(dto, req);

    });
  });

  describe('getCompanyInfoByStudent', () => {
    it('should return a companyProfile', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'getCompanyInfoByStudent')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.getCompanyInfoByStudent(1);

      expect(service.getCompanyInfoByStudent).toHaveBeenCalledWith(1);

      expect(response).toEqual(expectedResponse);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('preferences', () => {
    it('should update student prefs', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const dto = {
        mailNotifMessage: true,
        mailNotifGroup: true,
        mailNotifMission: false,
        mailNotifDocument: true,
      }

      const expectedResponse = null;

      jest
        .spyOn(service, 'updatePreferences')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.updatePreferences(req, dto);

      expect(service.updatePreferences).toHaveBeenCalledWith(req, dto);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('uploadFile', () => {
    it('should upload a specific file', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };
      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test-file.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        destination: './uploads',
        filename: 'test-file.txt',
        path: './uploads/test-file.txt',
        size: 1234,
        stream: null,
        buffer: Buffer.from(''),
      };

      const dto = {
        file: file,
        documentType: StudentDocumentType.CNI,
      }

      const expectedResponse = null;

      jest
        .spyOn(service, 'uploadStudentDocument')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.uploadStudentDocument(file, req, dto);

      expect(service.uploadStudentDocument).toHaveBeenCalledWith(file, dto, req.user);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('documentStatus', () => {
    it('should get student document status', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const expectedResponse = [
        {
          documentType: StudentDocumentType.CNI,
          status: DocumentStatus.PENDING,
          comment: null,
        }
      ]

      jest
        .spyOn(service, 'getDocumentStatus')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.getDocumentStatus(req);

      expect(service.getDocumentStatus).toHaveBeenCalledWith(req.user);

      expect(response).toEqual(expectedResponse);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
