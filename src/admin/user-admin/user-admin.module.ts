import { Module } from '@nestjs/common';
import { UserAdminService } from './user-admin.service';
import { UserAdminController } from './user-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentUser } from '../../student/entity/StudentUser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentUser]),
  ],
  providers: [UserAdminService],
  controllers: [UserAdminController],
})
export class UserAdminModule {}
