import { Injectable, NotFoundException } from '@nestjs/common';
import { FileService } from '../../filesystem/file.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { UploadDocumentAdminDto } from './dto/upload-document-admin.dto';
import { Document } from '../../documents/entity/document.entity';
import { UserAdminService } from '../user-admin/user-admin.service';
import { DocumentUserEnum } from '../../documents/enum/document-user.enum';
import { DocumentSearchOptionAdminDto } from './dto/document-search-option-admin.dto';
import { StudentDocument } from '../../student/entity/StudentDocuments.entity';
import { DocumentStatus, StudentDocumentType } from '../../student/enum/StudentDocument.enum';

@Injectable()
export class DocumentAdminService {
  constructor(
    private readonly fileService: FileService,
    @InjectRepository(Document)
    private readonly DocumentAdminRepository: Repository<Document>,
    private readonly userAdminService: UserAdminService,
    @InjectRepository(StudentDocument)
    private studentDocumentRepository: Repository<StudentDocument>,
  ) {}

  async findDocumentById(documentId: number): Promise<Document> {
    const document = await this.DocumentAdminRepository.findOne({
      where: { id: documentId },
    });
    if (!document) throw new NotFoundException(`DOCUMENT_NOT_FOUND`);
    return document;
  }

  async getAllDocuments(option: DocumentSearchOptionAdminDto): Promise<any> {
    const { searchString } = option;

    let documentsQuery: SelectQueryBuilder<Document> =
      this.DocumentAdminRepository.createQueryBuilder('document');

    documentsQuery = documentsQuery.andWhere(
      new Brackets((qb) => {
        if (searchString && searchString.trim().length > 0) {
          const searchParams = searchString
            .trim()
            .split(',')
            .map((elem) => elem.trim());

          searchParams.forEach((searchParam, index) => {
            const nameSearch = `nameSearch${index}`;

            qb.orWhere(`document.documentType LIKE :${nameSearch}`, {
              [nameSearch]: `%${searchParam}%`,
            });
          });
        }

        if (option.documentType) {
          qb.andWhere('document.documentType = :documentType', {
            documentType: option.documentType,
          });
        }

        if (option.documentUser) {
          qb.andWhere('document.documentUser = :documentUser', {
            documentUser: option.documentUser,
          });
        }

        if (option.userId) {
          qb.andWhere('document.userId = :userId', {
            userId: option.userId,
          });
        }
      }),
    );
    const documents = await documentsQuery.getMany();
    return documents;
  }

  async uploadDocument(
    document: any,
    body: UploadDocumentAdminDto,
  ): Promise<any> {
    if (body.documentUser === DocumentUserEnum.STUDENT) {
      const user = await this.userAdminService.findOneStudentById(
        parseInt(body.userId),
      );
      if (!user) throw new NotFoundException(`Could not find student`);
    }
    if (body.documentUser === DocumentUserEnum.COMPANY) {
      const user = await this.userAdminService.findOneCompanyById(
        parseInt(body.userId),
      );
      if (!user) throw new NotFoundException(`Could not find company`);
    }
    this.fileService
      .storeFile(document)
      .then(async (file: string) => {
        const filepath: string = file;
        const doc = new Document();
        doc.documentPath = filepath;
        doc.documentType = body.documentType;
        doc.documentUser = body.documentUser;
        doc.userId = parseInt(body.userId);
        this.DocumentAdminRepository.save(doc);
      })
      .catch((error: any) => {
        console.error('Error:', error);
      });
    return 'Document uploaded';
  }

  async deleteDocument(documentId: number): Promise<any> {
    const document = await this.findDocumentById(documentId);
    await this.fileService.deleteFile(document.documentPath);
    await this.DocumentAdminRepository.delete(documentId);
    return 'Document deleted';
  }

  async getDocument(documentId: number): Promise<any> {
    const document = await this.findDocumentById(documentId);
    return document;
  }

  async downloadDocument(documentId: number, res: any): Promise<any> {
    const document = await this.findDocumentById(documentId);
    const path = document.documentPath.replace(
      process.env.BASE_URL + '/public/',
      '',
    );
    return this.fileService.getFile(path, res);
  }


  async getStudentRib(studentId: number): Promise<any> {
    const document = await this.studentDocumentRepository.findOne({
      where: { studentId : studentId , documentType: StudentDocumentType.RIB, status: DocumentStatus.VERIFIED},
    });
    if (!document) throw new NotFoundException(`DOCUMENT_NOT_FOUND`);
    return document.file;
  }
}
