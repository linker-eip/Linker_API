import { Test, TestingModule } from '@nestjs/testing';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { FileService } from '../filesystem/file.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { DocumentTransferService } from '../document-transfer/src/services/document-transfer.service';
import { ConfigService } from '@nestjs/config';
import { CompanyUser } from '../company/entity/CompanyUser.entity';
import { CompanyProfile } from '../company/entity/CompanyProfile.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification, NotificationType } from './entity/Notification.entity';
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
import { StudentPreferences } from '../student/entity/StudentPreferences.entity';
import { CompanyPreferences } from '../company/entity/CompanyPreferences.entity';
import { MailService } from '../mail/mail.service';
import { StudentDocument } from '../student/entity/StudentDocuments.entity';
import { CompanyDocument } from '../company/entity/CompanyDocument.entity';
import { AiService } from '../ai/ai.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [NotificationsController],
      providers: [
        NotificationsService,
        StudentService,
        CompanyService,
        SkillsService,
        JobsService,
        MailService,
        StudiesService,
        FileService,
        DocumentTransferService,
        AiService,
        CompanyProfile,
        ConfigService,
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
          provide: getRepositoryToken(StudentPreferences),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyPreferences),
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

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get<NotificationsService>(NotificationsService);
  });

  describe('getNotifications', () => {
    it('should return all your notifications', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const expectedResponse = [
        {
          id: 1,
          title: 'Test notification',
          text: 'This notification exists for testing',
          type: NotificationType.MISSION,
          studentId: 1,
          companyId: null,
          isDeleted: false,
          alreadySeen: false,
          data: new Date(),
        },
      ];

      jest
        .spyOn(service, 'getNotifications')
        .mockResolvedValueOnce(expectedResponse);

      const response = await controller.getNotifications(req);

      expect(service.getNotifications).toHaveBeenCalledWith(req);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('updateNotifications', () => {
    it('should update your notification status', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const ids = [1];

      const expectedResponse = [
        {
          id: 1,
          title: 'Test notification',
          text: 'This notification exists for testing',
          type: NotificationType.MISSION,
          studentId: 1,
          companyId: null,
          isDeleted: false,
          alreadySeen: true,
          data: new Date(),
        },
      ];

      jest
        .spyOn(service, 'getNotifications')
        .mockResolvedValueOnce(expectedResponse);
      jest
        .spyOn(service, 'updateNotificationsStatus')
        .mockResolvedValueOnce(null);

      await controller.updateNotificationsStatus(req, { ids });
      const response = await controller.getNotifications(req);

      expect(service.updateNotificationsStatus).toHaveBeenCalledWith(req, {
        ids,
      });
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('deleteNotifications', () => {
    it('should return all your notifications', async () => {
      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const id = 1;

      const expectedResponse = [];

      jest
        .spyOn(service, 'getNotifications')
        .mockResolvedValueOnce(expectedResponse);
      jest.spyOn(service, 'deleteNotification').mockResolvedValueOnce(null);

      await controller.deleteNotification(req, id);
      const response = await controller.getNotifications(req);

      expect(service.deleteNotification).toHaveBeenCalledWith(req, id);
      expect(response).toEqual(expectedResponse);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
