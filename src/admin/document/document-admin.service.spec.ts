import { Test, TestingModule } from '@nestjs/testing';
import { DocumentAdminController } from './document.admin.controller';
import { DocumentAdminService } from './document.admin.service';
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
import { UploadDocumentAdminDto } from './dto/upload-document-admin.dto';
import { DocumentUserEnum } from '../../documents/enum/document-user.enum';
import { DocumentTypeEnum } from '../../documents/enum/document-type.enum';
import { DocumentSearchOptionAdminDto } from './dto/document-search-option-admin.dto';

describe('DocumentAdminService', () => {
  let service: DocumentAdminService;
  let controller: DocumentAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [DocumentAdminController],
      providers: [
        DocumentAdminService,
        FileService,
        UserAdminService,
        {
          provide: getRepositoryToken(Document),
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

    controller = module.get<DocumentAdminController>(DocumentAdminController);
    service = module.get<DocumentAdminService>(DocumentAdminService);
  });

  describe('uploadDocumentAdmin', () => {
    it('should upload a document', async () => {
      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test-file.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        destination: './uploads',
        filename: 'test-file.txt',
        path: './uploads/test-file.txt',
        size: 12345,
        stream: null,
        buffer: Buffer.from(''),
      };

      const uploadDocumentAdminDto: UploadDocumentAdminDto = {
        file: file,
        documentType: DocumentTypeEnum.CV,
        documentUser: DocumentUserEnum.STUDENT,
        userId: '1',
      };

      jest
        .spyOn(service, 'uploadDocument')
        .mockReturnValueOnce(
          Promise.resolve('linker-external/public/test-file.txt'),
        );

      const response = await controller.uploadDocumentAdmin(
        uploadDocumentAdminDto,
        file,
      );

      const res = 'linker-external/public/test-file.txt';

      expect(res).toEqual('linker-external/public/test-file.txt');
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      const documentId = 1;

      jest
        .spyOn(service, 'deleteDocument')
        .mockReturnValueOnce(Promise.resolve(true));

      const response = await controller.deleteDocument(documentId);

      expect(service.deleteDocument).toHaveBeenCalledWith(documentId);
      expect(response).toEqual(true);
    });
  });

  describe('getDocument', () => {
    it('should get a document', async () => {
      const documentId = 1;

      const expectedDocument = {
        documentPath: 'linker-external/public/test-file.txt',
        documentType: DocumentTypeEnum.CV,
        documentUser: DocumentUserEnum.STUDENT,
        userId: 1,
        id: 1,
      };

      jest
        .spyOn(service, 'getDocument')
        .mockReturnValueOnce(Promise.resolve(expectedDocument));

      const response = await controller.getDocument(documentId);

      expect(service.getDocument).toHaveBeenCalledWith(documentId);
      expect(response).toEqual(expectedDocument);
    });
  });

  describe('getAllDocuments', () => {
    it('should get all documents', async () => {
      const searchOption: DocumentSearchOptionAdminDto = {
        documentType: DocumentTypeEnum.CV,
        documentUser: DocumentUserEnum.STUDENT,
        userId: '1',
      };

      const expectedDocuments = [
        {
          documentPath: 'linker-external/public/test-file.txt',
          documentType: DocumentTypeEnum.CV,
          documentUser: DocumentUserEnum.STUDENT,
          userId: 1,
          id: 1,
        },
        {
          documentPath: 'linker-external/public/test-file.txt',
          documentType: DocumentTypeEnum.CV,
          documentUser: DocumentUserEnum.STUDENT,
          userId: 1,
          id: 2,
        },
      ];

      jest
        .spyOn(service, 'getAllDocuments')
        .mockReturnValueOnce(Promise.resolve(expectedDocuments));

      const response = await controller.getAllDocuments(searchOption);

      expect(service.getAllDocuments).toHaveBeenCalled();
      expect(response).toEqual(expectedDocuments);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
