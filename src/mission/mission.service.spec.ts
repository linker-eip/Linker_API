import { Test, TestingModule } from "@nestjs/testing";
import { MissionController } from "./mission.controller";
import { MissionService } from "./mission.service";
import { AuthGuard, PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { Mission } from "./entity/mission.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { FileService } from "../filesystem/file.service";
import { CompanyService } from "../company/company.service";
import { CompanyUser } from "../company/entity/CompanyUser.entity";
import { CompanyProfile } from "../company/entity/CompanyProfile.entity";
import { CreateMissionDto } from "./dto/create-mission-dto";
import { MissionStatus } from "./enum/mission-status.enum";
import { UpdateMissionDto } from "./dto/update-mission-dto";

describe('MissionService', () => {
  let service: MissionService;
  let controller: MissionController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [MissionController],
      providers: [MissionService, FileService, CompanyService,
        {
          provide: getRepositoryToken(Mission),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyUser),
          useClass: Repository,
        },        {
          provide: getRepositoryToken(CompanyProfile),
          useClass: Repository,
        }],
    })
    .overrideGuard(AuthGuard('jwt'))
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<MissionController>(MissionController);
    service = module.get<MissionService>(MissionService);
  });

  describe('createMission', () => {
    it('should create a mission', async () => {
      const createMissionDto: CreateMissionDto = {
        name: "Name",
        description: "Desc",
        startOfMission: null,
        endOfMission: null,
        amount: 100,
      };

      const req = {
        user : {
          email: "company@example.com",
        }
      }

      const expectedMission = {
        name: "Name",
        description: "Desc",
        startOfMission: null,
        endOfMission: null,
        amount: 100,
        id: 1,
        createdAt: new Date(),
        studentsIds: [],
        status: MissionStatus.PENDING,
        companyId: 1,

      };

      jest.spyOn(service, 'createMission').mockResolvedValueOnce(expectedMission);

      const response = await controller.createMission(req, createMissionDto);

      expect(service.createMission).toHaveBeenCalledWith(createMissionDto, req);
      expect(response).toEqual(expectedMission);
    });
  });

  describe('deleteMission', () => {
    it('should delete a mission', async () => {
      const req = {
        user : {
          email: "company@example.com",
        }
      }

      jest.spyOn(service, 'deleteMission').mockResolvedValueOnce({ affected: 1 , raw: true });

      const response = await controller.deleteMission(1, req);

      expect(service.deleteMission).toHaveBeenCalledWith(1, req);
      expect(response).toEqual({ affected: 1 , raw: true });
    });
  });

  describe('updateMission', () => {
    it('should update a mission', async () => {
      const updateMissionDto: UpdateMissionDto = {
        name: "Name",
        description: "New Desc",
        startOfMission: null,
        endOfMission: null,
        amount: 150,
      };

      const req = {
        user : {
          email: "company@example.com",
        }
      }

      const expectedMission = {
        name: "Name",
        description: "New Desc",
        startOfMission: null,
        endOfMission: null,
        amount: 150,
        id: 1,
        createdAt: new Date(),
        studentsIds: [],
        status: MissionStatus.PENDING,
        companyId: 1,

      };

      jest.spyOn(service, 'updateMission').mockResolvedValueOnce(expectedMission);

      const response = await controller.updateMission(1, updateMissionDto, req);

      expect(service.updateMission).toHaveBeenCalledWith(1, updateMissionDto, req);
      expect(response).toEqual(expectedMission);
    });
  });

  describe('getMission', () => {
    it('should return a mission list', async () => {
      const req = {
        user : {
          email: "company@example.com",
        }
      }

      const expectedMission = [{
        name: "Name",
        description: "New Desc",
        startOfMission: null,
        endOfMission: null,
        amount: 150,
        id: 1,
        createdAt: new Date(),
        studentsIds: [],
        status: MissionStatus.PENDING,
        companyId: 1,

      }];

      jest.spyOn(service, 'getCompanyMissions').mockResolvedValueOnce(expectedMission);

      const response = await controller.getMissions(req);

      expect(service.getCompanyMissions).toHaveBeenCalledWith(req);
      expect(response).toEqual(expectedMission);
    });
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});


