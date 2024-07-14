import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { StudentModule } from 'src/student/student.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entity/Message.entity';
import { CompanyUser } from 'src/company/entity/CompanyUser.entity';
import { Mission } from 'src/mission/entity/mission.entity';
import { CompanyModule } from 'src/company/company.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { GroupModule } from '../group/group.module';
import { MissionModule } from '../mission/mission.module';
import { DocumentTransferModule } from '../document-transfer/src/document-transfer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, CompanyUser, Mission]),
    StudentModule,
    CompanyModule,
    JwtModule,
    GroupModule,
    MissionModule,
    DocumentTransferModule,
  ],
  providers: [Gateway, ChatService],
  controllers: [ChatController],
})
export class GatewayModule {}
