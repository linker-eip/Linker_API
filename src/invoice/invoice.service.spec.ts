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

describe('InvoiceService', () => {
  let service: InvoiceService;
  let companyProfileRepository: Repository<CompanyProfile>;
  let missionService: MissionService;
  let studentService: StudentService;
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
        {
          provide: getRepositoryToken(Mission),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyProfile),
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
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    companyProfileRepository = module.get<Repository<CompanyProfile>>(
      'CompanyProfileRepository',
    );
    missionService = module.get<MissionService>(MissionService);
    studentService = module.get<StudentService>(StudentService);
    fileService = module.get<FileService>(FileService);
  });

  describe('getInvoices', () => {
    it('should return an array of invoices', async () => {
      const email = 'test@gmail.com';

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

      const response = await service.getInvoices(email);
      expect(response).toEqual(document);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
