import { Module, forwardRef } from '@nestjs/common';
import { AuthAdminService } from './auth.admin.service';
import { AuthAdminController } from './auth.admin.controller';
import { AdminModule } from '../admin.module';
import { StudentModule } from '../../student/student.module';
import { CompanyModule } from '../../company/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyUser } from '../../company/entity/CompanyUser.entity';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { NotificationsModule } from '../../notifications/notifications.module';

@Module({
  imports: [
    forwardRef(() => AdminModule),
    TypeOrmModule.forFeature([StudentUser, CompanyUser]),
    NotificationsModule,
  ],
  providers: [AuthAdminService],
  controllers: [AuthAdminController],
})
export class AuthAdminModule {}
