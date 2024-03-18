import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetDocumentStatusResponseDto } from './dto/get-document-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentDocument } from 'src/student/entity/StudentDocuments.entity';
import { Repository } from 'typeorm';
import { ValidateDocumentDto } from './dto/validate-document.dto';
import { DocumentStatus } from 'src/student/enum/StudentDocument.enum';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/entity/Notification.entity';
import { DenyDocumentDto } from './dto/deny-document.dto';

@Injectable()
export class DocumentVerificationService {
    constructor(
        @InjectRepository(StudentDocument)
        private readonly studentDocumentRepository: Repository<StudentDocument>,
        private readonly notificationService: NotificationsService
    ) {}

    async getAllDocuments(): Promise<GetDocumentStatusResponseDto>{
        const documents = await this.studentDocumentRepository.find();
        const dto = new GetDocumentStatusResponseDto

        Object.assign(dto, documents)
        return dto
    }

    async validateDocument(dto: ValidateDocumentDto) {
        const document = await this.studentDocumentRepository.findOne({where: {studentId: dto.studentId, documentType: dto.documentType}})
        if (!document) {
            throw new HttpException("Document invalide", HttpStatus.BAD_REQUEST);
        }
        document.status = DocumentStatus.VERIFIED;
        this.studentDocumentRepository.save(document);

        this.notificationService.createNotification("Document validé", "Votre document " + document.documentType + " a bien été validé par Linker.", NotificationType.DOCUMENT, dto.studentId, null)
    }

    async denyDocument(dto: DenyDocumentDto) {
        const document = await this.studentDocumentRepository.findOne({where: {studentId: dto.studentId, documentType: dto.documentType}})
        if (!document) {
            throw new HttpException("Document invalide", HttpStatus.BAD_REQUEST);
        }
        document.status = DocumentStatus.DENIED;
        document.comment = dto.comment;
        this.studentDocumentRepository.save(document);

        this.notificationService.createNotification("Document refusé", "Votre document " + document.documentType + " a été refusé par Linker. (" + dto.comment + ")", NotificationType.DOCUMENT, dto.studentId, null)
    }
}
