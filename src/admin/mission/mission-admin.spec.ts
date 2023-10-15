import { Test, TestingModule } from '@nestjs/testing';
import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserAdminService } from '../user-admin/user-admin.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { Mission } from '../../mission/entity/mission.entity';
import { CompanyUser } from '../../company/entity/CompanyUser.entity';
import { CompanyProfile } from '../../company/entity/CompanyProfile.entity';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { StudentProfile } from '../../student/entity/StudentProfile.entity';
import { MissionStatus } from '../../mission/enum/mission-status.enum';
import { UpdateMission } from './dto/update-mission.dto';

describe('MissionService', () => {
  let service: MissionService;
  let controller: MissionController;

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
      providers: [
        MissionService,
        UserAdminService,
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
          provide: getRepositoryToken(StudentUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentProfile),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<MissionController>(MissionController);
    service = module.get<MissionService>(MissionService);
  });

  describe('createMission', () => {
    it('should create a mission', async () => {
      const createMissionDto: CreateMissionDto = {
        name: 'Name',
        description: 'Desc',
        startOfMission: null,
        endOfMission: null,
        amount: 100,
        companyId: 1,
        studentsIds: [1, 2],
      };

      const expectedMission: Mission = {
        name: 'Name',
        description: 'Desc',
        startOfMission: null,
        endOfMission: null,
        amount: 100,
        id: 1,
        createdAt: new Date(),
        studentsIds: [1, 2],
        status: MissionStatus.PENDING,
        companyId: 1,
      };

      jest
        .spyOn(service, 'createMission')
        .mockResolvedValueOnce(expectedMission);

      const response = await controller.createMission(createMissionDto);

      expect(service.createMission).toHaveBeenCalledWith(createMissionDto);
      expect(response).toEqual(expectedMission);
    });
  });

  describe('deleteMission', () => {
    it('should delete a mission', async () => {
      const id = 1;

      const expectedResponse: DeleteResult = {
        raw: [],
        affected: 1,
      };

      jest
        .spyOn(service, 'deleteMission')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.deleteMission(id);

      expect(service.deleteMission).toHaveBeenCalledWith(id);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('updateMission', () => {
    it('should update a mission', async () => {
      const updateMission: UpdateMission = {
        name: 'Name',
        description: 'Desc',
        startOfMission: null,
        endOfMission: null,
        amount: 100,
        companyId: 1,
        status: MissionStatus.PENDING,
        studentsIds: [1, 2],
      };

      const expectedMission: Mission = {
        name: 'Name',
        description: 'Desc',
        startOfMission: null,
        endOfMission: null,
        amount: 100,
        id: 1,
        createdAt: new Date(),
        studentsIds: [1, 2],
        status: MissionStatus.PENDING,
        companyId: 1,
      };

      jest
        .spyOn(service, 'updateMission')
        .mockResolvedValueOnce(expectedMission);

      const response = await controller.updateMission(1, updateMission);

      expect(service.updateMission).toHaveBeenCalledWith(1, updateMission);
      expect(response).toEqual(expectedMission);
    });
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
