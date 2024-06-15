import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import { MissionModule } from '../mission/mission.module';
import { StudentModule } from '../student/student.module';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { StudentPayment } from 'src/payment/entity/student-payment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentPayment]),
        MissionModule,
        StudentModule,
    ],
    controllers: [StatisticsController],
    providers: [StatisticsService],
    exports: [StatisticsService],
})
export class StatisticsModule { }
