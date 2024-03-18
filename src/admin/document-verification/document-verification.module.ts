import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyDocument } from 'src/company/entity/CompanyDocument.entity';
import { StudentDocument } from 'src/student/entity/StudentDocuments.entity';
import { DocumentVerificationService } from './document-verification.service';
import { DocumentVerificationController } from './document-verification.controller';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
    imports: [TypeOrmModule.forFeature([StudentDocument, CompanyDocument]), NotificationsModule],
    exports: [DocumentVerificationService],
    providers: [DocumentVerificationService],
    controllers: [DocumentVerificationController]
})
export class DocumentVerificationModule {}
