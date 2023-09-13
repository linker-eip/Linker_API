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
import { FileService } from 'src/filesystem/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudentUser, StudentProfile]), JobsModule, StudiesModule, SkillsModule],
  controllers: [StudentController],
  providers: [StudentService, FileService],
  exports: [StudentService],
})
export class StudentModule {}
