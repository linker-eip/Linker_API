import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { FileService } from '../filesystem/file.service';
import { SkillsService } from '../student/skills/skills.service';
import { JobsService } from '../student/jobs/jobs.service';
import { StudiesService } from '../student/studies/studies.service';
import { CompanyUser } from './entity/CompanyUser.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Skills } from '../student/skills/entity/skills.entity';
import { Studies } from '../student/studies/entity/studies.entity';
import { Jobs } from '../student/jobs/entity/jobs.entity';
import { CompanyProfile } from './entity/CompanyProfile.entity';
import { CompanyDocument } from './entity/CompanyDocument.entity';
import { CompanyPreferences } from './entity/CompanyPreferences.entity';
import { DocumentTransferService } from '../document-transfer/src/services/document-transfer.service';
import { ConfigService } from '@nestjs/config';
import { StudentService } from '../student/student.service';
import { StudentProfile } from '../student/entity/StudentProfile.entity';
import { StudentPreferences } from '../student/entity/StudentPreferences.entity';
import { StudentDocument } from '../student/entity/StudentDocuments.entity';
import { StudentUser } from '../student/entity/StudentUser.entity';
import { DocumentStatusResponseDto } from './dto/document-status-response.dto';
import {
  CompanyDocumentType,
  DocumentStatus,
} from './enum/CompanyDocument.enum';
import { AiService } from '../ai/ai.service';

describe('CompanyService', () => {
  let service: CompanyService;
  let controller: CompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [CompanyController],
      providers: [
        CompanyService,
        DocumentTransferService,
        ConfigService,
        StudentService,
        AiService,
        SkillsService,
        JobsService,
        StudiesService,
        FileService,
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
        },
        {
          provide: getRepositoryToken(StudentUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyDocument),
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
          provide: getRepositoryToken(CompanyPreferences),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyProfile),
          useClass: Repository,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CompanyController>(CompanyController);
    service = module.get<CompanyService>(CompanyService);
  });

  describe('getCompanyProfile', () => {
    it('should return a companyProfile', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const expectedProfile = {
        id: 1,
        description: "I'm John Doe",
        email: 'test@example.com',
        phone: '0612345678',
        website: 'http://example.com',
        companyId: 1,
        name: 'Example Company',
        location: 'Marseille',
        address: '21 rue Mirès',
        size: 50,
        activity: '',
        speciality: 'IT',
        company: null,
        picture: '',
      };

      jest
        .spyOn(service, 'findCompanyProfile')
        .mockResolvedValueOnce(expectedProfile);

      const response = await controller.getCompanyProfile(req);

      expect(service.findCompanyProfile).toHaveBeenCalledWith(req.user.email);
      expect(response).toEqual(expectedProfile);
    });
  });

  describe('updateCompanyProfile', () => {
    it('should return a companyProfile', async () => {
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
        activity: 'Example Activity',
        name: 'Example Company',
        address: '21 rue Mirès',
        size: 50,
        speciality: 'IT',
      };

      const expectedProfile = {
        id: 1,
        description: "I'm John Doe",
        email: 'test@example.com',
        phone: '0612345678',
        website: 'http://example.com',
        companyId: 1,
        name: 'Example Company',
        location: 'Paris',
        address: '21 rue Mirès',
        size: 50,
        activity: 'Example Activity',
        speciality: 'IT',
        company: null,
        picture: '',
      };

      jest
        .spyOn(service, 'updateCompanyProfile')
        .mockResolvedValueOnce(expectedProfile);

      const response = await controller.updateCompanyProfile(req, newProfile);

      expect(response).toEqual(expectedProfile);
    });
  });

  describe('getDocumentStatus', () => {
    it('should return a companyDocument', async () => {
      const req = {
        user: {
          email: 'test@gmail.com',
        },
      };

      const expectedDocument: DocumentStatusResponseDto = {
        documentType: CompanyDocumentType.CNI,
        status: DocumentStatus.VERIFIED,
        comment: 'Document validé',
        bis: false,
      };

      jest
        .spyOn(service, 'getDocumentStatus')
        .mockResolvedValueOnce([expectedDocument]);

      const response = await controller.getDocumentStatus(req);

      expect(response).toEqual([expectedDocument]);
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
        documentType: CompanyDocumentType.KBIS,
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'uploadCompanyDocument')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.uploadCompanyDocument(file, req, dto);

      expect(service.uploadCompanyDocument).toHaveBeenCalledWith(
        file,
        dto,
        req.user,
      );

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('replaceDocument', () => {
    it('should replace a specific file', async () => {
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
        documentType: CompanyDocumentType.KBIS,
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'replaceCompanyDocument')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.replaceCompanyDocument(file, req, dto);

      expect(service.replaceCompanyDocument).toHaveBeenCalledWith(
        file,
        dto,
        req.user,
      );

      expect(response).toEqual(expectedResponse);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
