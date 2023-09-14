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

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser]),
    UserAdminModule,
    AuthAdminModule,
    MissionModule,
    DocumentAdminModule,
  ],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
