import { Module } from '@nestjs/common';
import { UserAdminService } from './user-admin.service';
import { UserAdminController } from './user-admin.controller';
import { StudentModule } from '../../student/student.module';

@Module({
  imports: [StudentModule],
  providers: [UserAdminService],
  controllers: [UserAdminController]
})
export class UserAdminModule {}
