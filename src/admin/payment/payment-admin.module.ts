import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentPayment } from '../../payment/entity/student-payment.entity';
import { PaymentService } from '../../payment/payment.service';
import { PaymentAdminService } from './payment-admin.service';
import { PaymentAdminController } from './payment-admin.controller';
import { UserAdminModule } from '../user-admin/user-admin.module';
import { MissionModule } from '../mission/mission.module';

@Module({
  imports: [TypeOrmModule.forFeature([StudentPayment]), UserAdminModule, MissionModule],
  providers: [PaymentAdminService],
  controllers: [PaymentAdminController]
})
export class PaymentAdminModule {}
