import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/Notification.entity';
import { NotificationsController } from './notifications.controller';
import { StudentModule } from '../student/student.module';
import { CompanyModule } from '../company/company.module';
import { StudentPreferences } from '../student/entity/StudentPreferences.entity';
import { MailModule } from '../mail/mail.module';
import { CompanyPreferences } from '../company/entity/CompanyPreferences.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      StudentPreferences,
      CompanyPreferences,
    ]),
    StudentModule,
    CompanyModule,
    MailModule,
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
