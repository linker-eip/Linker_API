import { Module, forwardRef } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyUser } from '../company/entity/CompanyUser.entity';
import { CompanyProfile } from '../company/entity/CompanyProfile.entity';
import { CompanyDocument } from './entity/CompanyDocument.entity';
import { DocumentTransferService } from 'src/document-transfer/src/services/document-transfer.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyUser, CompanyProfile, CompanyDocument]),
  ],
  providers: [CompanyService, DocumentTransferService, ConfigService],
  controllers: [CompanyController],
  exports: [CompanyService,],
})
export class CompanyModule { }
