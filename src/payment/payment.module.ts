import { Module, forwardRef } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { StudentPayment } from './entity/student-payment.entity';
import { CompanyModule } from '../company/company.module';
import { MissionModule } from '../mission/mission.module';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, StudentPayment]),
    CompanyModule,
    forwardRef(() => MissionModule),
    StudentModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
