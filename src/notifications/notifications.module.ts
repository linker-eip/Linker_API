import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/Notification.entity';
import { NotificationsController } from './notifications.controller';
import { StudentModule } from 'src/student/student.module';
import { CompanyModule } from 'src/company/company.module';
import { StudentPreferences } from 'src/student/entity/StudentPreferences.entity';
import { MailModule } from 'src/mail/mail.module';
import { CompanyPreferences } from 'src/company/entity/CompanyPreferences.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, StudentPreferences, CompanyPreferences]),
    StudentModule,
    CompanyModule,
    MailModule
  ],
  providers: [NotificationsService,],
  exports: [NotificationsService],
  controllers: [NotificationsController]
})
export class NotificationsModule {}
