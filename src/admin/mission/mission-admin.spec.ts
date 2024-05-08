import { Test, TestingModule } from '@nestjs/testing';
import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserAdminService } from '../user-admin/user-admin.service';
import { Mission } from '../../mission/entity/mission.entity';
import { CompanyUser } from '../../company/entity/CompanyUser.entity';
import { CompanyProfile } from '../../company/entity/CompanyProfile.entity';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { StudentProfile } from '../../student/entity/StudentProfile.entity';
import { MissionStatus } from '../../mission/enum/mission-status.enum';
import { UpdateMission } from './dto/update-mission.dto';
import { missionAdminResponseDto } from './dto/mission-admin-response.dto';
import { CreateMissionAdminDto } from './dto/create-mission.dto';

describe('MissionService', () => {
  let service: MissionService;
  let userAdminService: UserAdminService;
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
    userAdminService = module.get<UserAdminService>(UserAdminService);
  });

  describe('createMission', () => {
    it('should create a mission', async () => {
      const createMissionDto: CreateMissionAdminDto = {
        name: 'Name',
        description: 'Desc',
        startOfMission: null,
        endOfMission: null,
        amount: 100,
        companyId: 1,
        groupId: null,
      };

      const expectedMission: Mission = {
        name: 'Name',
        description: 'Desc',
        startOfMission: null,
        endOfMission: null,
        amount: 100,
        id: 1,
        createdAt: new Date(),
        groupId: null,
        status: MissionStatus.PENDING,
        companyId: 1,
        skills: '',
        comments: null,
        isNoted: false,
        specificationsFile: null,
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
        groupId: 2,
      };

      const expectedMission: Mission = {
        name: 'Name',
        description: 'Desc',
        startOfMission: null,
        endOfMission: null,
        amount: 100,
        id: 1,
        createdAt: new Date(),
        groupId: 2,
        status: MissionStatus.PENDING,
        companyId: 1,
        skills: '',
        comments: null,
        isNoted: false,
        specificationsFile: null,
      };

      jest
        .spyOn(service, 'updateMission')
        .mockResolvedValueOnce(expectedMission);

      const response = await controller.updateMission(1, updateMission);

      expect(service.updateMission).toHaveBeenCalledWith(1, updateMission);
      expect(response).toEqual(expectedMission);
    });
  });

  

  describe('getMission', () => {
    it('should return a mission', async () => {
      const id = 1;

      const expectedMission: Mission = {
        name: 'Name',
        description: 'Desc',
        startOfMission: null,
        endOfMission: null,
        amount: 100,
        id: 1,
        createdAt: new Date(),
        groupId: 2,
        status: MissionStatus.PENDING,
        companyId: 1,
        skills: '',
        comments: null,
        isNoted: false,
        specificationsFile: null,
      };

      const expectedResponse: missionAdminResponseDto = {
        name: 'Name',
        description: 'Desc',
        startOfMission: null,
        endOfMission: null,
        amount: 100,
        id: 1,
        status: MissionStatus.PENDING,
        numberOfStudents: 0,
        company: {
          companyName: 'Company',
          companyPicture: null,
          createdAt: new Date('2023-10-13T03:43:23.946Z'),
          email: 'tonybano83@gmail.com',
          id: 1,
          isActive: true,
          lastConnectedAt: new Date('2023-10-13T03:43:23.946Z'),
          phoneNumber: '0612345678',
          picture: null,
          password: null,
          resetPasswordToken: null,
          profile: null,
        },
      };

      jest
        .spyOn(service, 'findMissionById')
        .mockResolvedValueOnce(expectedMission);

      const company: CompanyUser = {
        id: 1,
        email: 'tonybano83@gmail.com',
        password: 'Azerty1234!',
        picture: null,
        isActive: true,
        lastConnectedAt: new Date('2023-10-13T03:43:23.946Z'),
        createdAt: new Date('2023-10-13T03:43:23.946Z'),
        resetPasswordToken: null,
        companyName: 'Company',
        phoneNumber: '0612345678',
        companyPicture: null,
        profile: null,
      };

      jest
        .spyOn(userAdminService, 'findOneCompanyById')
        .mockResolvedValueOnce(company);

      const response = await controller.getMission(id);

      expect(service.findMissionById).toHaveBeenCalledWith(id);
      expect(expectedResponse).toEqual(expectedResponse);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
