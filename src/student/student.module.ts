import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentUser } from './entity/StudentUser.entity';
import { StudentProfile } from './entity/StudentProfile.entity';
import { JobsModule } from './jobs/jobs.module';
import { StudiesService } from './studies/studies.service';
import { StudiesModule } from './studies/studies.module';
import { SkillsModule } from './skills/skills.module';
import { FileService } from '../filesystem/file.service';
import { DocumentTransferService } from '../document-transfer/src/services/document-transfer.service';
import { ConfigService } from '@nestjs/config';
import { CompanyModule } from '../company/company.module';
import { StudentPreferences } from './entity/StudentPreferences.entity';
import { StudentDocument } from './entity/StudentDocuments.entity';
import { Jobs } from './jobs/entity/jobs.entity';
import { Studies } from './studies/entity/studies.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentUser,
      StudentProfile,
      StudentPreferences,
      StudentDocument,
      Jobs,
      Studies,
    ]),
    JobsModule,
    StudiesModule,
    SkillsModule,
    CompanyModule,
  ],
  controllers: [StudentController],
  providers: [
    StudentService,
    FileService,
    DocumentTransferService,
    ConfigService,
  ],
  exports: [StudentService],
})
export class StudentModule {}
