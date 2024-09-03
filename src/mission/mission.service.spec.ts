import { Test, TestingModule } from '@nestjs/testing';
import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Mission } from './entity/mission.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { FileService } from '../filesystem/file.service';
import { CompanyService } from '../company/company.service';
import { CompanyUser } from '../company/entity/CompanyUser.entity';
import { CompanyProfile } from '../company/entity/CompanyProfile.entity';
import { CreateMissionDto } from './dto/create-mission-dto';
import { MissionStatus } from './enum/mission-status.enum';
import { UpdateMissionDto } from './dto/update-mission-dto';
import { MissionTask } from './entity/mission-task.entity';
import { GroupService } from '../group/group.service';
import { StudentService } from '../student/student.service';
import { MissionInvite } from './entity/mission-invite.entity';
import { Group } from '../group/entity/Group.entity';
import { GroupInvite } from '../group/entity/GroupInvite.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { StudentUser } from '../student/entity/StudentUser.entity';
import { StudentProfile } from '../student/entity/StudentProfile.entity';
import { SkillsService } from '../student/skills/skills.service';
import { JobsService } from '../student/jobs/jobs.service';
import { StudiesService } from '../student/studies/studies.service';
import { DocumentTransferService } from '../document-transfer/src/services/document-transfer.service';
import { Notification } from '../notifications/entity/Notification.entity';
import { Skills } from '../student/skills/entity/skills.entity';
import { Jobs } from '../student/jobs/entity/jobs.entity';
import { Studies } from '../student/studies/entity/studies.entity';
import { ConfigService } from '@nestjs/config';
import { UpdateTaskStatusDto } from './dto/update-task-status-dto';
import { MissionTaskStatus } from './enum/mission-task-status.enum';
import { CreateMissionTaskDto } from './dto/create-mission-task.dto';
import { UpdateMissionTaskDto } from './dto/update-mission-task.dto';
import { MissionSearchOptionStudentDto } from './dto/mission-search-option-student.dto';
import { CommentMissionDto } from './dto/comment-mission.dto';
import { NoteMissionDto } from './dto/note-mission.dto';
import { CompanyDocument } from '../company/entity/CompanyDocument.entity';
import { CompanyPreferences } from '../company/entity/CompanyPreferences.entity';
import { StudentPreferences } from '../student/entity/StudentPreferences.entity';
import { StudentDocument } from '../student/entity/StudentDocuments.entity';
import { MailService } from '../mail/mail.service';
import { PaymentService } from '../payment/payment.service';
import { Payment } from '../payment/entity/payment.entity';
import { StudentPayment } from '../payment/entity/student-payment.entity';

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
        FileService,
        CompanyService,
        GroupService,
        StudentService,
        NotificationsService,
        StudentService,
        SkillsService,
        JobsService,
        StudiesService,
        DocumentTransferService,
        ConfigService,
        MailService,
        PaymentService,
        {
          provide: getRepositoryToken(Mission),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Payment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentPayment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyProfile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MissionTask),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MissionInvite),
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
          provide: 'MAILER_PROVIDER',
          useValue: {
            sendMail: jest.fn(),
          },
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
          provide: getRepositoryToken(Notification),
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
          provide: getRepositoryToken(CompanyDocument),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyPreferences),
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
        name: 'Name',
        description: 'Desc',
        startOfMission: null,
        endOfMission: null,
        amount: 100,
        skills: 'Skills',
        specifications: null,
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

      const req = {
        user: {
          email: 'company@example.com',
        },
      };

      const expectedMission = {
        name: 'Name',
        description: 'Desc',
        startOfMission: null,
        endOfMission: null,
        amount: 100,
        id: 1,
        createdAt: new Date(),
        studentsIds: [],
        status: MissionStatus.PENDING,
        companyId: 1,
        skills: 'Skills',
        groupId: null,
        comments: null,
        isNoted: false,
        specificationsFile: null,
      };

      jest
        .spyOn(service, 'createMission')
        .mockResolvedValueOnce(expectedMission);

      const response = await controller.createMission(
        file,
        req,
        createMissionDto,
      );

      expect(service.createMission).toHaveBeenCalledWith(
        createMissionDto,
        req,
        file,
      );
      expect(response).toEqual(expectedMission);
    });
  });

  describe('deleteMission', () => {
    it('should delete a mission', async () => {
      const req = {
        user: {
          email: 'company@example.com',
        },
      };

      jest
        .spyOn(service, 'deleteMission')
        .mockResolvedValueOnce({ affected: 1, raw: true });

      const response = await controller.deleteMission(1, req);

      expect(service.deleteMission).toHaveBeenCalledWith(1, req);
      expect(response).toEqual({ affected: 1, raw: true });
    });
  });

  describe('updateMission', () => {
    it('should update a mission', async () => {
      const updateMissionDto: UpdateMissionDto = {
        name: 'Name',
        description: 'New Desc',
        startOfMission: null,
        endOfMission: null,
        amount: 150,
        skills: null,
        groupId: null,
        specifications: null,
      };

      const req = {
        user: {
          email: 'company@example.com',
        },
      };

      const expectedMission = {
        name: 'Name',
        description: 'New Desc',
        startOfMission: null,
        endOfMission: null,
        amount: 150,
        id: 1,
        createdAt: new Date(),
        studentsIds: [],
        status: MissionStatus.PENDING,
        companyId: 1,
        groupId: null,
        skills: 'Skills',
        comments: null,
        isNoted: false,
        specificationsFile: null,
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

      jest
        .spyOn(service, 'updateMission')
        .mockResolvedValueOnce(expectedMission);

      const response = await controller.updateMission(
        file,
        1,
        updateMissionDto,
        req,
      );

      expect(service.updateMission).toHaveBeenCalledWith(
        1,
        updateMissionDto,
        req,
        file,
      );
      expect(response).toEqual(expectedMission);
    });
  });

  describe('getMission', () => {
    it('should return a mission list', async () => {
      const req = {
        user: {
          email: 'company@example.com',
        },
      };

      const expectedMission = [
        {
          name: 'Name',
          description: 'New Desc',
          startOfMission: null,
          endOfMission: null,
          amount: 150,
          id: 1,
          createdAt: new Date(),
          studentsIds: [],
          status: MissionStatus.PENDING,
          companyId: 1,
          skills: 'Skills',
          groupId: null,
          comments: null,
          isNoted: false,
          specificationsFile: null,
        },
      ];

      jest
        .spyOn(service, 'getCompanyMissions')
        .mockResolvedValueOnce(expectedMission);

      const response = await controller.getMissions(req);

      expect(service.getCompanyMissions).toHaveBeenCalledWith(req);
      expect(response).toEqual(expectedMission);
    });
  });

  describe('affectTask', () => {
    it('should affect task to a student', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

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
        user: {
          email: 'test@example.com',
        },
      };

      const dto: UpdateTaskStatusDto = {
        status: MissionTaskStatus.PENDING,
      };

      const taskId = 1;

      const expectedResponse = null;

      jest
        .spyOn(service, 'updateTaskStatus')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.updateTaskStatus(taskId, dto, req);

      expect(service.updateTaskStatus).toHaveBeenCalledWith(taskId, dto, req);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('createMissionTask', () => {
    it('should create a mission task', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const dto: CreateMissionTaskDto = {
        name: 'Name',
        description: 'Desc',
        studentId: 1,
        amount: 100,
        skills: 'Skills',
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'createMissionTask')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.createMissionTask(1, dto, req);

      expect(service.createMissionTask).toHaveBeenCalledWith(1, dto, req);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('updateMissionTask', () => {
    it('should update a mission task', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const dto: UpdateMissionTaskDto = {
        name: 'Name',
        description: 'Desc',
        studentId: 1,
        amount: 100,
        skills: 'Skills',
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'updateMissionTask')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.updateMissionTask(1, dto, req);

      expect(service.updateMissionTask).toHaveBeenCalledWith(1, dto, req);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('deleteMissionTask', () => {
    it('should delete a mission task', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'deleteMissionTask')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.deleteMissionTask(1, req);

      expect(service.deleteMissionTask).toHaveBeenCalledWith(1, req);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('getMissionTasks', () => {
    it('should get all mission tasks', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'getMissionTasks')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.getMissionTasks(1, req);

      expect(service.getMissionTasks).toHaveBeenCalledWith(1, req);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('acceptMission', () => {
    it('should accept a mission', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'acceptMission')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.acceptMission(1, 1, req);

      expect(service.acceptMission).toHaveBeenCalledWith(1, 1, req);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('refuseMission', () => {
    it('should refuse a mission', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'refuseMission')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.refuseMission(1, 1, req);

      expect(service.refuseMission).toHaveBeenCalledWith(1, 1, req);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('finishMission', () => {
    it('should finish a mission', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'finishMission')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.finishMission(1, req);

      expect(service.finishMission).toHaveBeenCalledWith(1, req);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('getMissionDetails', () => {
    it('should get mission details for company', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },

        params: {
          missionId: 1,
        },
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'getMissionDetailsCompany')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.getMissionDetails(1, req);

      expect(service.getMissionDetailsCompany).toHaveBeenCalledWith(1, req);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('getMissionDetailsStudent', () => {
    it('should get mission details for student', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },

        params: {
          missionId: 1,
        },
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'getMissionDetailsStudent')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.getMissionDetailsStudent(1, req);

      expect(service.getMissionDetailsStudent).toHaveBeenCalledWith(1, req);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('getStudentMissions', () => {
    it('should get all missions for a student', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const dto: MissionSearchOptionStudentDto = {
        status: MissionStatus.PENDING,
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'getStudentMissions')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.getStudentMissions(dto, req);

      expect(service.getStudentMissions).toHaveBeenCalledWith(req, dto);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('inviteGroup', () => {
    it('should invite a group to a mission', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'inviteGroup')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.inviteGroup(1, 1, req);

      expect(service.inviteGroup).toHaveBeenCalledWith(1, 1, req);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('getMissionInvites', () => {
    it('should get all invitations for a student', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'getMissionInvites')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.getStudentInvitations(req, null);

      expect(service.getMissionInvites).toHaveBeenCalledWith(req, null);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('commentMission', () => {
    it('should comment a mission', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const dto: CommentMissionDto = {
        comment: 'Comment',
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'commentMission')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.commentMission(1, dto, req);

      expect(service.commentMission).toHaveBeenCalledWith(1, dto, req);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('noteGroup', () => {
    it('should comment a mission', async () => {
      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const dto: NoteMissionDto = {
        note: 4,
      };

      const expectedResponse = null;

      jest.spyOn(service, 'noteGroup').mockResolvedValueOnce(expectedResponse);

      const response = await controller.noteGroup(1, dto, req);

      expect(service.noteGroup).toHaveBeenCalledWith(1, dto, req);

      expect(response).toEqual(expectedResponse);
    });
  });

  //createMissionTaskStudent
  describe('createMissionTaskStudent', () => {
    it('should create a mission task for student', async () => {
      const req = {
        user: {
          email: 'test@gmail.com',
        },
      };

      const dto: CreateMissionTaskDto = {
        name: 'Name',
        description: 'Desc',
        studentId: 1,
        amount: 100,
        skills: 'Skills',
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'createMissionTaskStudent')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.createMissionTaskStudent(1, dto, req);

      expect(service.createMissionTaskStudent).toHaveBeenCalledWith(
        1,
        dto,
        req,
      );

      expect(response).toEqual(expectedResponse);
    });
  });

  //updateMissionTaskStudent
  describe('updateMissionTaskStudent', () => {
    it('should update a mission task for student', async () => {
      const req = {
        user: {
          email: 'test@gmail.com',
        },
      };

      const dto: UpdateMissionTaskDto = {
        name: 'Name',
        description: 'Desc',
        studentId: 1,
        amount: 100,
        skills: 'Skills',
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'updateMissionTaskStudent')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.updateMissionTaskStudent(1, dto, req);

      expect(service.updateMissionTaskStudent).toHaveBeenCalledWith(
        1,
        dto,
        req,
      );

      expect(response).toEqual(expectedResponse);
    });
  });

  //deleteMissionTaskStudent
  describe('deleteMissionTaskStudent', () => {
    it('should delete a mission task for student', async () => {
      const req = {
        user: {
          email: 'test@gmail.com',
        },
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'deleteMissionTaskStudent')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.deleteMissionTaskStudent(1, req);

      expect(service.deleteMissionTaskStudent).toHaveBeenCalledWith(1, req);

      expect(response).toEqual(expectedResponse);
    });
  });

  //acceptGroup
  describe('acceptGroup', () => {
    it('should accept a group', async () => {
      const req = {
        user: {
          email: 'test@gmail.com',
        },
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'acceptGroup')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.acceptGroup(1, 1, req);

      expect(service.acceptGroup).toHaveBeenCalledWith(1, 1, req);

      expect(response).toEqual(expectedResponse);
    });
  });

  //refuseGroup
  describe('refuseGroup', () => {
    it('should refuse a group', async () => {
      const req = {
        user: {
          email: 'test@gmail.com',
        },
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'refuseGroup')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.refuseGroup(1, 1, req);

      expect(service.refuseGroup).toHaveBeenCalledWith(1, 1, req);

      expect(response).toEqual(expectedResponse);
    });
  });

  //getInvitedStudents
  describe('getInvitedStudents', () => {
    it('should get invited students', async () => {
      const req = {
        user: {
          email: 'test@gmail.com',
        },
      };

      const expectedResponse = null;

      jest
        .spyOn(service, 'getInvitedGroups')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.getInvitedStudents(req, 1);

      expect(service.getInvitedGroups).toHaveBeenCalledWith(req, 1);

      expect(response).toEqual(expectedResponse);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
