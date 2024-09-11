import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { MissionModule } from '../mission/mission.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyProfile } from '../company/entity/CompanyProfile.entity';
import { StudentModule } from '../student/student.module';
import { Document } from '../documents/entity/document.entity';
import { FileModule } from '../filesystem/file.module';
import { InvoiceController } from './invoice.controller';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyProfile, Document]),
    MissionModule,
    StudentModule,
    FileModule,
    CompanyModule,
  ],
  providers: [InvoiceService],
  exports: [InvoiceService],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
