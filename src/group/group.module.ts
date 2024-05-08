import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entity/Group.entity';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { StudentModule } from '../student/student.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { GroupInvite } from './entity/GroupInvite.entity';
import { CompanyModule } from '../company/company.module';
import { Mission } from '../mission/entity/mission.entity';
import { StudentDocument } from '../student/entity/StudentDocuments.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Group, GroupInvite, Mission, StudentDocument]),
        StudentModule,
        NotificationsModule,
        CompanyModule,
    ],
    providers: [GroupService,],
    controllers: [GroupController],
    exports: [GroupService]
})
export class GroupModule {}
