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
import { MissionTask } from "./entity/mission-task.entity";
import { GroupService } from "../group/group.service";
import { StudentService } from "../student/student.service";
import { MissionInvite } from "./entity/mission-invite.entity";
import { Group } from "../group/entity/Group.entity";
import { GroupInvite } from "../group/entity/GroupInvite.entity";
import { NotificationsService } from "../notifications/notifications.service";
import { StudentUser } from "../student/entity/StudentUser.entity";
import { StudentProfile } from "../student/entity/StudentProfile.entity";
import { SkillsService } from "../student/skills/skills.service";
import { JobsService } from "../student/jobs/jobs.service";
import { StudiesService } from "../student/studies/studies.service";
import { DocumentTransferService } from "../document-transfer/src/services/document-transfer.service";
import { Notification } from "../notifications/entity/Notification.entity";
import { Skills } from "../student/skills/entity/skills.entity";
import { Jobs } from "../student/jobs/entity/jobs.entity";
import { Studies } from "../student/studies/entity/studies.entity";
import { ConfigService } from "@nestjs/config";
import { UpdateTaskStatusDto } from "./dto/update-task-status-dto";
import { MissionTaskStatus } from "./enum/mission-task-status.enum";

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
      providers: [MissionService, FileService, CompanyService, GroupService, StudentService, 
        NotificationsService, StudentService, SkillsService, JobsService, StudiesService, DocumentTransferService, ConfigService,
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
        },
      {
        provide: getRepositoryToken(MissionTask),
        useClass: Repository,
      },{
        provide: getRepositoryToken(MissionInvite),
        useClass: Repository,
      },{
        provide: getRepositoryToken(Group),
        useClass: Repository,
      },{
        provide: getRepositoryToken(GroupInvite),
        useClass: Repository,
      },
      {
        provide: getRepositoryToken(StudentUser),
        useClass: Repository,
      },
      {
        provide: getRepositoryToken(StudentProfile),
        useClass: Repository,
      },{
        provide: getRepositoryToken(Notification),
        useClass: Repository,
      },{
        provide: getRepositoryToken(Skills),
        useClass: Repository,
      },{
        provide: getRepositoryToken(Jobs),
        useClass: Repository,
      },{
        provide: getRepositoryToken(Studies),
        useClass: Repository,
      },
    ],
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
        skills: "Skills"
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
        skills: "Skills",
        groupId: null,
        comments: null,
        isNoted: false,
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
        skills: null,
        groupId: null,
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
        groupId: null,
        skills: "Skills",
        comments: null,
        isNoted: false,

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
        skills: "Skills",
        groupId: null,
        comments: null,
        isNoted: false,

      }];

      jest.spyOn(service, 'getCompanyMissions').mockResolvedValueOnce(expectedMission);

      const response = await controller.getMissions(req);

      expect(service.getCompanyMissions).toHaveBeenCalledWith(req);
      expect(response).toEqual(expectedMission);
    });
  });

  describe('affectTask', () => {
    it('should affect task to a student', async () => {
      const req = {
        user : {
          email: "test@example.com",
        }
      }

      const taskId = 1;
      const studentId = 1;

      const expectedResponse = null;

      jest.spyOn(service, 'affectTask').mockResolvedValueOnce(expectedResponse);

      const response = await controller.affectTask(taskId, studentId, req);

      expect(service.affectTask).toHaveBeenCalledWith(taskId, studentId, req);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status', async () => {
      const req = {
        user : {
          email: "test@example.com",
        }
      }

      const dto: UpdateTaskStatusDto = {
        status: MissionTaskStatus.PENDING
      }

      const taskId = 1;

      const expectedResponse = null;

      jest.spyOn(service, 'updateTaskStatus').mockResolvedValueOnce(expectedResponse);

      const response = await controller.updateTaskStatus(taskId, dto, req);

      expect(service.updateTaskStatus).toHaveBeenCalledWith(taskId, dto, req);
      expect(response).toEqual(expectedResponse);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});


