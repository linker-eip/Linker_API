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
import { StudentService } from 'src/student/student.service';
import { StudentUser } from 'src/student/entity/StudentUser.entity';
import { StudentProfile } from 'src/student/entity/StudentProfile.entity';
import { StudentPreferences } from 'src/student/entity/StudentPreferences.entity';
import { StudentDocument } from 'src/student/entity/StudentDocuments.entity';
import { Jobs } from 'src/student/jobs/entity/jobs.entity';
import { Studies } from 'src/student/studies/entity/studies.entity';
import { Skills } from 'src/student/skills/entity/skills.entity';
import { SkillsService } from 'src/student/skills/skills.service';
import { JobsService } from 'src/student/jobs/jobs.service';
import { StudiesService } from 'src/student/studies/studies.service';
import { FileService } from 'src/filesystem/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyUser, CompanyProfile, CompanyDocument, CompanyPreferences, StudentUser, StudentProfile, StudentPreferences, StudentDocument, Jobs, Studies, Skills]),
  ],
  providers: [CompanyService, DocumentTransferService, ConfigService, StudentService, SkillsService, JobsService, StudiesService, FileService],
  controllers: [CompanyController],
  exports: [CompanyService,],
})
export class CompanyModule { }
