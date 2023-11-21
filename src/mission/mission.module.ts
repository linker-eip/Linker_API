import { Module, forwardRef } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './entity/mission.entity';
import { CompanyModule } from '../company/company.module';
import { MissionTask } from './entity/mission-task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mission, MissionTask]),
    CompanyModule,
  ],
  providers: [MissionService],
  controllers: [MissionController],
  exports: [MissionService],
})
export class MissionModule {}
