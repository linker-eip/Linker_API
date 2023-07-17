import { Module } from '@nestjs/common';
import { UserAdminModule } from './user-admin/user-admin.module';
import { AuthAdminModule } from './auth/auth.admin.module';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './entity/AdminUser.entity';
import { APP_GUARD } from '@nestjs/core';
import { AdminGuard } from './guards/admin/admin.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser]),
    UserAdminModule,
    AuthAdminModule,
  ],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
