import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entity/Ticket.entity';
import { StudentModule } from '../student/student.module';
import { CompanyUser } from '../company/entity/CompanyUser.entity';
import { CompanyModule } from '../company/company.module';
import { StudentUser } from '../student/entity/StudentUser.entity';
import { Mission } from '../mission/entity/mission.entity';
import { DocumentTransferModule } from '../document-transfer/src/document-transfer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, StudentUser, CompanyUser, Mission]),
    StudentModule,
    CompanyModule,
    DocumentTransferModule,
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
