import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from '../../mission/entity/mission.entity';
import { UserAdminModule } from '../user-admin/user-admin.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mission]), UserAdminModule],
  providers: [MissionService],
  controllers: [MissionController],
  exports: [MissionService]
})
export class MissionModule {}
