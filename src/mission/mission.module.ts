import { Module, forwardRef } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './entity/mission.entity';
import { CompanyModule } from '../company/company.module';
import { MissionTask } from './entity/mission-task.entity';
import { GroupModule } from '../group/group.module';
import { StudentModule } from '../student/student.module';
import { MissionInvite } from './entity/mission-invite.entity';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mission, MissionTask, MissionInvite]),
    CompanyModule,
    GroupModule,
    StudentModule,
    forwardRef(() => PaymentModule),
  ],
  providers: [MissionService],
  controllers: [MissionController],
  exports: [MissionService],
})
export class MissionModule {}
