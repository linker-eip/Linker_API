import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { MissionModule } from '../mission/mission.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), MissionModule, CompanyModule],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
