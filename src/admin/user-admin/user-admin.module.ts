import { Module } from '@nestjs/common';
import { UserAdminService } from './user-admin.service';
import { UserAdminController } from './user-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { StudentProfile } from '../../student/entity/StudentProfile.entity';
import { CompanyUser } from '../../company/entity/CompanyUser.entity';
import { CompanyProfile } from '../../company/entity/CompanyProfile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentUser,
      StudentProfile,
      CompanyUser,
      CompanyProfile,
    ]),
  ],
  providers: [UserAdminService],
  controllers: [UserAdminController],
  exports: [UserAdminService],
})
export class UserAdminModule {}
