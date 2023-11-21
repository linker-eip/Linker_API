import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/Notification.entity';
import { NotificationsController } from './notifications.controller';
import { StudentModule } from 'src/student/student.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    StudentModule,
    CompanyModule,
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
  controllers: [NotificationsController]
})
export class NotificationsModule {}
