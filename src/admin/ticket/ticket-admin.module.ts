import { Module } from '@nestjs/common';
import { TicketAdminService } from './ticket-admin.service';
import { TicketAdminController } from './ticket-admin.controller';
import { Ticket, TicketAnswer } from '../../ticket/entity/Ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTransferModule } from '../../document-transfer/src/document-transfer.module';
import { StudentModule } from '../../student/student.module';
import { NotificationsModule } from '../../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, TicketAnswer]),
    DocumentTransferModule,
    StudentModule,
    NotificationsModule,
  ],
  providers: [TicketAdminService],
  controllers: [TicketAdminController],
})
export class TicketAdminModule {
}
