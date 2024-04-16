import { Test, TestingModule } from "@nestjs/testing";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { AuthGuard, PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { FileService } from "../filesystem/file.service";
import { SkillsService } from "../student/skills/skills.service";
import { JobsService } from "../student/jobs/jobs.service";
import { StudiesService } from "../student/studies/studies.service";
import { CompanyUser } from "./entity/CompanyUser.entity";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Skills } from "../student/skills/entity/skills.entity";
import { Studies } from "../student/studies/entity/studies.entity";
import { Jobs } from "../student/jobs/entity/jobs.entity";
import { CompanyProfile } from "./entity/CompanyProfile.entity";
import { CompanyDocument } from "./entity/CompanyDocument.entity";
import { CompanyPreferences } from "./entity/CompanyPreferences.entity";
import { DocumentTransferService } from "../document-transfer/src/services/document-transfer.service";
import { ConfigService } from "@nestjs/config";

describe('CompanyService', () => {
  let service: CompanyService;
  let controller: CompanyController

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
      providers: [CompanyService, FileService,ConfigService, DocumentTransferService, SkillsService, JobsService, StudiesService,
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
          provide: getRepositoryToken(CompanyDocument),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyPreferences),
          useClass: Repository,
        }, {
          provide: getRepositoryToken(CompanyProfile),
          useClass: Repository
        }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CompanyController>(CompanyController);
    service = module.get<CompanyService>(CompanyService);
  })

  describe('getCompanyProfile', () => {
    it('should return a companyProfile', async () => {
      const req = {
        user: {
          email: "test@example.com",
        }
      }

      const expectedProfile = {
        id: 1,
        description: "I'm John Doe",
        email: "test@example.com",
        phone: "0612345678",
        website: "http://example.com",
        companyId: 1,
        name: "Example Company",
        location: "Marseille",
        address: "21 rue Mirès",
        size: 50,
        activity: "",
        speciality: "IT",
        company: null,
        picture: "",
      };

      jest.spyOn(service, 'findCompanyProfile').mockResolvedValueOnce(expectedProfile);

      const response = await controller.getCompanyProfile(req);

      expect(service.findCompanyProfile).toHaveBeenCalledWith(req.user.email);
      expect(response).toEqual(expectedProfile);
    });
  });

  describe('updateCompanyProfile', () => {
    it('should return a companyProfile', async () => {
      const req = {
        user: {
          email: "test@example.com",
        }
      }

      const newProfile = {
        location: "Paris",
        phone: "0612345678",
        lastName: "Doe",
        firstName: "John",
        picture: null,
        email: "test@example.com",
        website: "http://example.com",
        description: "New Description",
        activity: "Example Activity",
        name: "Example Company",
        address: "21 rue Mirès",
        size: 50,
        speciality: "IT",
      }

      const expectedProfile = {
        id: 1,
        description: "I'm John Doe",
        email: "test@example.com",
        phone: "0612345678",
        website: "http://example.com",
        companyId: 1,
        name: "Example Company",
        location: "Paris",
        address: "21 rue Mirès",
        size: 50,
        activity: "Example Activity",
        speciality: "IT",
        company: null,
        picture: "",
      };

      jest.spyOn(service, 'updateCompanyProfile').mockResolvedValueOnce(expectedProfile);

      const response = await controller.updateCompanyProfile(req, newProfile);

      expect(response).toEqual(expectedProfile);
    });
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});