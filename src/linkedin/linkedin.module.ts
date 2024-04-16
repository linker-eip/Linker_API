import { Module } from '@nestjs/common';
import { LinkedinService } from './linkedin.service';
import { LinkedinController } from './linkedin.controller';
import { StudentModule } from '../student/student.module';

@Module({
    imports: [StudentModule],
    providers: [LinkedinService],
    controllers: [LinkedinController],
    exports: [LinkedinService]
})
export class LinkedinModule {}
