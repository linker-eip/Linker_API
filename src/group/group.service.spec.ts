import { Test, TestingModule } from '@nestjs/testing';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { FileService } from '../filesystem/file.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { DocumentTransferService } from '../document-transfer/src/services/document-transfer.service';
import { ConfigService } from '@nestjs/config';
import { Mission } from '../mission/entity/mission.entity';
import { CompanyUser } from '../company/entity/CompanyUser.entity';
import { CompanyProfile } from '../company/entity/CompanyProfile.entity';
import {
  Notification,
  NotificationType,
} from '../notifications/entity/Notification.entity';
import { StudentService } from '../student/student.service';
import { CompanyService } from '../company/company.service';
import { StudentUser } from '../student/entity/StudentUser.entity';
import { StudentProfile } from '../student/entity/StudentProfile.entity';
import { SkillsService } from '../student/skills/skills.service';
import { JobsService } from '../student/jobs/jobs.service';
import { StudiesService } from '../student/studies/studies.service';
import { Skills } from '../student/skills/entity/skills.entity';
import { Jobs } from '../student/jobs/entity/jobs.entity';
import { Studies } from '../student/studies/entity/studies.entity';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Group } from './entity/Group.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { GroupInvite } from './entity/GroupInvite.entity';
import { GetGroupeResponse } from './dto/get-group-response-dto';
import { GetInvitesResponse } from './dto/get-invites-response-dto';
import { StudentPreferences } from '../student/entity/StudentPreferences.entity';
import { StudentDocument } from '../student/entity/StudentDocuments.entity';
import { CompanyDocument } from '../company/entity/CompanyDocument.entity';
import { CompanyPreferences } from '../company/entity/CompanyPreferences.entity';
import { MailService } from '../mail/mail.service';
import { AiService } from '../ai/ai.service';
import { GetCompanySearchGroupsDto } from "./dto/get-company-search-groups.dto";
import {CompanySearchGroupsFilterDto} from "./dto/company-search-groups-filter.dto";

describe('NotificationsService', () => {
  let service: GroupService;
  let controller: GroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [GroupController],
      providers: [
        GroupService,
        StudentService,
        CompanyService,
        SkillsService,
        JobsService,
        StudiesService,
        FileService,
        DocumentTransferService,
        AiService,
        CompanyProfile,
        ConfigService,
        NotificationsService,
        MailService,
        {
          provide: getRepositoryToken(Notification),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentProfile),
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
          provide: getRepositoryToken(Studies),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Group),
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
          provide: getRepositoryToken(StudentPreferences),
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
        {
          provide: getRepositoryToken(CompanyPreferences),
          useClass: Repository,
        },
        {
          provide: 'MAILER_PROVIDER',
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<GroupController>(GroupController);
    service = module.get<GroupService>(GroupService);
  });

  describe('createGroup', () => {
    it('should create a group', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const dto = {
        name: 'Test group',
        description: 'Test group description',
        picture: 'image://test-picture.jpg',
      };

      const expectedResponse: Group = {
        id: 1,
        name: 'Test group',
        description: 'Test group description',
        picture: 'image://test-picture.jpg',
        studentIds: [1],
        leaderId: 1,
        isActive: true,
      };

      jest
        .spyOn(service, 'createGroup')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.createGroup(req, dto);

      expect(service.createGroup).toHaveBeenCalledWith(req, dto);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('updateGroup', () => {
    it('should update your group', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const dto = {
        name: 'New Test group',
        description: 'New Test group description',
      };

      const expectedResponse: Group = {
        id: 1,
        name: 'New Test group',
        description: 'New Test group description',
        picture: 'image://test-picture.jpg',
        studentIds: [1],
        leaderId: 1,
        isActive: true,
      };

      jest
        .spyOn(service, 'updateGroup')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.updateGroup(req, dto);

      expect(service.updateGroup).toHaveBeenCalledWith(req, dto);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('getGroup', () => {
    it('should return your group', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const expectedResponse: GetGroupeResponse = {
        name: 'New Test group',
        description: 'New Test group description',
        picture: 'image://test-picture.jpg',
        members: [
          {
            firstName: 'Test',
            lastName: 'TestName',
            picture: 'image://test-picture.jpg',
            isLeader: true,
            id: 1,
          },
        ],
        leaderId: 1,
        isLeader: true,
        groupId: 1,
        isActive: true,
      };

      jest.spyOn(service, 'getGroup').mockResolvedValueOnce(expectedResponse);

      const response = await controller.getGroup(req);

      expect(service.getGroup).toHaveBeenCalledWith(req);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('deleteGroup', () => {
    it('should delete your group', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const expectedResponse: Group = null;

      jest.spyOn(service, 'deleteGroup').mockResolvedValueOnce(null);
      jest.spyOn(service, 'getGroup').mockResolvedValueOnce(null);

      await controller.deleteGroup(req);
      const response = await controller.getGroup(req);

      expect(service.deleteGroup).toHaveBeenCalledWith(req);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('inviteUser', () => {
    it('should invite someone to your group', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const userId = 2;

      jest.spyOn(service, 'inviteUser').mockResolvedValueOnce(null);

      const response = await controller.inviteUser(req, userId);

      expect(service.inviteUser).toHaveBeenCalledWith(req, userId);
      expect(response).toEqual(null);
    });
  });

  describe('cancelInvite', () => {
    it('should cancel invite to your group', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const userId = 2;

      jest.spyOn(service, 'cancelInvite').mockResolvedValueOnce(null);

      const response = await controller.cancelInvite(req, userId);

      expect(service.cancelInvite).toHaveBeenCalledWith(req, userId);
      expect(response).toEqual(null);
    });
  });

  describe('getGroupInvites', () => {
    it('should get invites to your group', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const expectedResponse: GetInvitesResponse[] = [
        {
          id: 2,
          name: 'Test User2',
          description: 'New test group description',
          picture: 'image://test-image.jpg',
          leaderName: null,
        },
      ];

      jest
        .spyOn(service, 'getGroupInvites')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.getGroupInvites(req);

      expect(service.getGroupInvites).toHaveBeenCalledWith(req);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('getInvites', () => {
    it('should your invites', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const expectedResponse: GetInvitesResponse[] = [
        {
          id: 1,
          description: 'New test group description',
          name: 'New Test group',
          picture: 'image://test-image.jpg',
          leaderName: 'Test User',
        },
      ];

      jest.spyOn(service, 'getInvites').mockResolvedValueOnce(expectedResponse);

      const response = await controller.getInvites(req);

      expect(service.getInvites).toHaveBeenCalledWith(req);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('acceptInvite', () => {
    it('should accept an invite', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const groupId = 1;

      jest.spyOn(service, 'acceptInvite').mockResolvedValueOnce(null);

      const response = await controller.acceptInvite(req, groupId);

      expect(service.acceptInvite).toHaveBeenCalledWith(req, groupId);
      expect(response).toEqual(null);
    });
  });

  describe('refuseInvite', () => {
    it('should refuse an invite', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const groupId = 1;

      jest.spyOn(service, 'refuseInvite').mockResolvedValueOnce(null);

      const response = await controller.refuseInvite(req, groupId);

      expect(service.refuseInvite).toHaveBeenCalledWith(req, groupId);
      expect(response).toEqual(null);
    });
  });

  describe('leave', () => {
    it('should leave a group', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      jest.spyOn(service, 'leaveGroup').mockResolvedValueOnce(null);

      const response = await controller.leaveGroup(req);

      expect(service.leaveGroup).toHaveBeenCalledWith(req);
      expect(response).toEqual(null);
    });
  });

  describe('transfer', () => {
    it('should transfer group property', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      jest.spyOn(service, 'transferLeadership').mockResolvedValueOnce(null);

      const response = await controller.transferLeadership(req, 2);

      expect(service.transferLeadership).toHaveBeenCalledWith(req, 2);
      expect(response).toEqual(null);

    });
  });

  describe('getAllGroups', () => {
    it('should get all groups', async () => {
      const req = {
        user: {
          email: "test@gmail.com",
        }
      }

      const dto: CompanySearchGroupsFilterDto = {
        groupName: "Test group",
      }

      const expectedResponse: GetCompanySearchGroupsDto[] = [
        {
          id: 1,
          name: "Test group",
          description: "Test group description",
          studentsProfiles: [],
          score: 0,
        }
      ]

      jest.spyOn(service, 'getAllGroups').mockResolvedValueOnce(expectedResponse);

      const response = await controller.getAllGroups(dto, req);

      expect(service.getAllGroups).toHaveBeenCalledWith(req, dto);

      expect(response).toEqual(expectedResponse);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
