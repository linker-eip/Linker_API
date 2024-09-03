import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  GetDocumentStatusCompanyResponseDto,
  GetDocumentStatusStudentsResponseDto,
} from './dto/get-document-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentDocument } from '../../student/entity/StudentDocuments.entity';
import { Repository } from 'typeorm';
import {
  ValidateDocumentCompanyDto,
  ValidateDocumentStudentDto,
} from './dto/validate-document.dto';
import { DocumentStatus } from '../../student/enum/StudentDocument.enum';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationType } from '../../notifications/entity/Notification.entity';
import {
  DenyDocumentCompanyDto,
  DenyDocumentStudentDto,
} from './dto/deny-document.dto';
import { CompanyDocument } from '../../company/entity/CompanyDocument.entity';

@Injectable()
export class DocumentVerificationService {
  constructor(
    @InjectRepository(StudentDocument)
    private readonly studentDocumentRepository: Repository<StudentDocument>,
    @InjectRepository(CompanyDocument)
    private readonly companyDocumentRepository: Repository<CompanyDocument>,
    private readonly notificationService: NotificationsService,
  ) {
  }

  async getAllDocumentsStudent(): Promise<GetDocumentStatusStudentsResponseDto> {
    const documents = await this.studentDocumentRepository.find();
    const dto = new GetDocumentStatusStudentsResponseDto();

    Object.assign(dto, documents);
    return dto;
  }

  async getAllDocumentsCompany(): Promise<GetDocumentStatusCompanyResponseDto> {
    const documents = await this.companyDocumentRepository.find();
    const dto = new GetDocumentStatusCompanyResponseDto();

    Object.assign(dto, documents);
    return dto;
  }

  async validateDocumentStudent(dto: ValidateDocumentStudentDto) {
    const document = await this.studentDocumentRepository.findOne({
      where: {
        studentId: dto.studentId,
        documentType: dto.documentType,
        bis: dto.bis,
      },
    });
    if (!document) {
      throw new HttpException('Document invalide', HttpStatus.BAD_REQUEST);
    }
    if (document.bis) {
      const docToReplace = await this.studentDocumentRepository.findOne({
        where: {
          studentId: dto.studentId,
          documentType: dto.documentType,
          bis: false,
        },
      });
      if (!docToReplace) {
        throw new HttpException(
          'Il n\'y a pas de document à remplacer',
          HttpStatus.BAD_REQUEST,
        );
      }
      docToReplace.file = document.file;
      docToReplace.comment = '';
      this.studentDocumentRepository.delete(document);
      this.studentDocumentRepository.save(docToReplace);
    } else {
      document.status = DocumentStatus.VERIFIED;
      this.studentDocumentRepository.save(document);
    }

    this.notificationService.createNotification(
      'Document validé',
      'Votre document ' +
      document.documentType +
      ' a bien été validé par Linker.',
      NotificationType.DOCUMENT,
      dto.studentId,
      null,
    );
  }

  async denyDocumentStudent(dto: DenyDocumentStudentDto) {
    const document = await this.studentDocumentRepository.findOne({
      where: {
        studentId: dto.studentId,
        documentType: dto.documentType,
        bis: dto.bis,
      },
    });
    if (!document) {
      throw new HttpException('Document invalide', HttpStatus.BAD_REQUEST);
    }
    document.status = DocumentStatus.DENIED;
    document.comment = dto.comment;
    this.studentDocumentRepository.save(document);

    this.notificationService.createNotification(
      'Document refusé',
      'Votre document ' +
      document.documentType +
      ' a été refusé par Linker. (' +
      dto.comment +
      ')',
      NotificationType.DOCUMENT,
      dto.studentId,
      null,
    );
  }

  async validateDocumentCompany(dto: ValidateDocumentCompanyDto) {
    const document = await this.companyDocumentRepository.findOne({
      where: {
        companyId: dto.companyId,
        documentType: dto.documentType,
        bis: dto.bis,
      },
    });
    if (!document) {
      throw new HttpException('Document invalide', HttpStatus.BAD_REQUEST);
    }
    if (document.bis) {
      const docToReplace = await this.companyDocumentRepository.findOne({
        where: {
          companyId: dto.companyId,
          documentType: dto.documentType,
          bis: false,
        },
      });
      if (!docToReplace) {
        throw new HttpException(
          'Il n\'y a pas de document à remplacer',
          HttpStatus.BAD_REQUEST,
        );
      }
      docToReplace.file = document.file;
      docToReplace.comment = '';
      this.companyDocumentRepository.delete(document);
      this.companyDocumentRepository.save(docToReplace);
    } else {
      document.status = DocumentStatus.VERIFIED;
      this.companyDocumentRepository.save(document);
    }

    this.notificationService.createNotification(
      'Document validé',
      'Votre document ' +
      document.documentType +
      ' a bien été validé par Linker.',
      NotificationType.DOCUMENT,
      null,
      dto.companyId,
    );
  }

  async denyDocumentCompany(dto: DenyDocumentCompanyDto) {
    const document = await this.companyDocumentRepository.findOne({
      where: {
        companyId: dto.companyId,
        documentType: dto.documentType,
        bis: dto.bis,
      },
    });
    if (!document) {
      throw new HttpException('Document invalide', HttpStatus.BAD_REQUEST);
    }
    document.status = DocumentStatus.DENIED;
    document.comment = dto.comment;
    this.companyDocumentRepository.save(document);

    this.notificationService.createNotification(
      'Document refusé',
      'Votre document ' +
      document.documentType +
      ' a été refusé par Linker. (' +
      dto.comment +
      ')',
      NotificationType.DOCUMENT,
      null,
      dto.companyId,
    );
  }
}
