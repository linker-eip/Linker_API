import { Module, forwardRef } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyUser } from '../company/entity/CompanyUser.entity';
import { CompanyProfile } from '../company/entity/CompanyProfile.entity';
import { CompanyDocument } from './entity/CompanyDocument.entity';
import { DocumentTransferService } from '../document-transfer/src/services/document-transfer.service';
import { ConfigService } from '@nestjs/config';
import { CompanyPreferences } from './entity/CompanyPreferences.entity';
import { StudentService } from '../student/student.service';
import { StudentUser } from '../student/entity/StudentUser.entity';
import { StudentProfile } from '../student/entity/StudentProfile.entity';
import { StudentPreferences } from '../student/entity/StudentPreferences.entity';
import { StudentDocument } from '../student/entity/StudentDocuments.entity';
import { Jobs } from '../student/jobs/entity/jobs.entity';
import { Studies } from '../student/studies/entity/studies.entity';
import { Skills } from '../student/skills/entity/skills.entity';
import { SkillsService } from '../student/skills/skills.service';
import { JobsService } from '../student/jobs/jobs.service';
import { StudiesService } from '../student/studies/studies.service';
import { FileService } from '../filesystem/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyUser,
      CompanyProfile,
      CompanyDocument,
      CompanyPreferences,
      StudentUser,
      StudentProfile,
      StudentPreferences,
      StudentDocument,
      Jobs,
      Studies,
      Skills,
    ]),
  ],
  providers: [
    CompanyService,
    DocumentTransferService,
    ConfigService,
    StudentService,
    SkillsService,
    JobsService,
    StudiesService,
    FileService,
  ],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {
}
