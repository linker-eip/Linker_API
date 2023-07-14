import { Module } from '@nestjs/common';
import { UserAdminModule } from './user-admin/user-admin.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserAdminModule, AuthModule]
})
export class AdminModule {}
