import { Module } from '@nestjs/common';
import { UserAdminModule } from './user-admin/user-admin.module';
import { AuthAdminModule } from './auth/auth.admin.module';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './entity/AdminUser.entity';
import { APP_GUARD } from '@nestjs/core';
import { AdminGuard } from './guards/admin/admin.guard';
import { MissionModule } from './mission/mission.module';
import { DocumentAdminModule } from './document/document.admin.module';
import { ContactAdminModule } from './contact/contact-admin.module';
import { DocumentVerificationController } from './document-verification/document-verification.controller';
import { DocumentVerificationService } from './document-verification/document-verification.service';
import { DocumentVerificationModule } from './document-verification/document-verification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser]),
    UserAdminModule,
    AuthAdminModule,
    MissionModule,
    DocumentAdminModule,
    ContactAdminModule,
    DocumentVerificationModule
  ],
  providers: [AdminService,],
  exports: [AdminService],
  controllers: [],
})
export class AdminModule {}
