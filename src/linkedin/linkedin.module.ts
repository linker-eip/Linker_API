import { Module } from '@nestjs/common';
import { LinkedinService } from './linkedin.service';
import { LinkedinController } from './linkedin.controller';
import { StudentModule } from '../student/student.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [StudentModule, CompanyModule],
  providers: [LinkedinService],
  controllers: [LinkedinController],
  exports: [LinkedinService],
})
export class LinkedinModule {}
