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
import { DocumentTransferModule } from '../document-transfer/src/document-transfer.module';
import { CompanyDocument } from '../company/entity/CompanyDocument.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Mission,
      MissionTask,
      MissionInvite,
      CompanyDocument,
    ]),
    CompanyModule,
    GroupModule,
    StudentModule,
    PaymentModule,
    forwardRef(() => PaymentModule),
    DocumentTransferModule,
  ],
  providers: [MissionService],
  controllers: [MissionController],
  exports: [MissionService],
})
export class MissionModule {}
