import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { Skills } from './entity/skills.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsController } from './skills.controller';
import { CompanyModule } from '../../company/company.module';
import { StudentService } from '../student.service';
import { StudentDocument } from '../entity/StudentDocuments.entity';
import { StudentPreferences } from '../entity/StudentPreferences.entity';
import { StudentProfile } from '../entity/StudentProfile.entity';
import { StudentUser } from '../entity/StudentUser.entity';
import { Jobs } from '../jobs/entity/jobs.entity';
import { Studies } from '../studies/entity/studies.entity';
import { JobsService } from '../jobs/jobs.service';
import { StudiesService } from '../studies/studies.service';
import { FileService } from '../../filesystem/file.service';
import { DocumentTransferService } from '../../document-transfer/src/services/document-transfer.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Skills,
      StudentUser,
      StudentProfile,
      StudentPreferences,
      StudentDocument,
      Jobs,
      Studies,
      Skills,
    ]),
    CompanyModule,
  ],
  controllers: [SkillsController],
  providers: [
    SkillsService,
    StudentService,
    JobsService,
    StudiesService,
    FileService,
    DocumentTransferService,
    ConfigService,
  ],
  exports: [SkillsService],
})
export class SkillsModule {}
