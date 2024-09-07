import { Module, forwardRef } from '@nestjs/common';
import { AuthAdminService } from './auth.admin.service';
import { AuthAdminController } from './auth.admin.controller';
import { AdminModule } from '../admin.module';
import { StudentModule } from '../../student/student.module';
import { CompanyModule } from '../../company/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyUser } from '../../company/entity/CompanyUser.entity';
import { StudentUser } from '../../student/entity/StudentUser.entity';

@Module({
  imports: [forwardRef(() => AdminModule),
    TypeOrmModule.forFeature([StudentUser, CompanyUser])],
  providers: [AuthAdminService],
  controllers: [AuthAdminController],
})
export class AuthAdminModule {}
