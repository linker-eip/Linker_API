import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { MissionModule } from '../mission/mission.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyProfile } from '../company/entity/CompanyProfile.entity';
import { StudentModule } from '../student/student.module';
import { PdfController } from './pdf.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyProfile]),MissionModule, StudentModule
  ],
  providers: [PdfService],
  exports: [PdfService],
  controllers: [PdfController]
})
export class PdfModule {}
