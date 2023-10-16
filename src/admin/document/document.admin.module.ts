import { Module } from '@nestjs/common';
import { FileModule } from '../../filesystem/file.module';
import { DocumentAdminService } from './document.admin.service';
import { DocumentAdminController } from './document.admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../../documents/entity/document.entity';
import { UserAdminModule } from '../user-admin/user-admin.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), FileModule, UserAdminModule],
  controllers: [DocumentAdminController],
  providers: [DocumentAdminService],
})
export class DocumentAdminModule {}
