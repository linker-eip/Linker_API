import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyProfile } from '../../company/entity/CompanyProfile.entity';
import { CompanyUser } from '../../company/entity/CompanyUser.entity';
import { StudentProfile } from '../../student/entity/StudentProfile.entity';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { Document } from '../../documents/entity/document.entity';
import { FileService } from '../../filesystem/file.service';
import { UserAdminService } from '../user-admin/user-admin.service';
import { DocumentUserEnum } from '../../documents/enum/document-user.enum';
import { DocumentTypeEnum } from '../../documents/enum/document-type.enum';
import { ContactAdminService } from './contact.admin.service';
import { ContactAdminController } from './contact.admin.controller';
import { Contact } from './entity/contact.entity';

describe('ContactAdminService', () => {
  let service: ContactAdminService;
  let controller: ContactAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [ContactAdminController],
      providers: [
        ContactAdminService,
        {
          provide: getRepositoryToken(Contact),
          useClass: Repository,
        }
      ],
      exports: [ContactAdminService],
    }).compile();

    controller = module.get<ContactAdminController>(ContactAdminController);
    service = module.get<ContactAdminService>(ContactAdminService);
  });

  describe('get contact', () => {
    it('should get all contact', async () => {
      const contacts : Contact[] = [
        {
          id: 1,
          email: 'test@gmail.com',
          object: 'test',
          content: 'test',
          createdAt: new Date(),
          isTreated: false,
        },
        {
          id: 1,
          email: 'test2@gmail.com',
          object: 'test',
          content: 'test',
          createdAt: new Date(),
          isTreated: false,
        }];

        
      jest.spyOn(service, 'findAll').mockResolvedValue(contacts);

      const res = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(contacts).toEqual(res);
    }
    );
  }
  );

  describe('delete contact', () => {
    it('should delete a contact', async () => {
      const contact : Contact = {
          id: 1,
          email: 'test@gmail.com',
          object: 'test',
          content: 'test',
          createdAt: new Date(),
          isTreated: false,
      };

      jest.spyOn(service, 'delete').mockResolvedValue(contact);

      const res = await controller.delete(1);

      expect(service.delete).toHaveBeenCalled();

      expect(contact).toEqual(res);

    }
    );
  }
  );

  describe('update contact', () => {
    it('should update a contact', async () => {
      const updateContactDto = {
        email: 'test@gmail.com',
        object: 'test',
        content: 'test',
        isTreated: true,
      };

      const contact : Contact = {
          id: 1,
          email: 'test@gmail.com',
          object: 'test',
          content: 'test',
          createdAt: new Date(),
          isTreated: false,
      };

      jest.spyOn(service, 'update').mockResolvedValue(contact);

      const res = await controller.update(updateContactDto, 1);

      expect(service.update).toHaveBeenCalled();

      expect(contact).toEqual(res);

    }
    );
  }
  );

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
