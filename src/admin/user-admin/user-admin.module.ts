import { Module } from '@nestjs/common';
import { UserAdminService } from './user-admin.service';
import { UserAdminController } from './user-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { StudentProfile } from '../../student/entity/StudentProfile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentUser, StudentProfile]),
  ],
  providers: [UserAdminService],
  controllers: [UserAdminController],
})
export class UserAdminModule {}
