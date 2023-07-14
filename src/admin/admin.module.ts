import { Module } from '@nestjs/common';
import { UserAdminModule } from './user-admin/user-admin.module';
import { AuthAdminModule } from './auth/auth.module';

@Module({
  imports: [UserAdminModule, AuthAdminModule]
})
export class AdminModule {}
