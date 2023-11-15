import { Injectable } from '@nestjs/common';
import { NotificationType, Notification } from './entity/Notification.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentService } from 'src/student/student.service';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class NotificationsService {
    
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,

        private readonly studentService: StudentService,
        private readonly companyService: CompanyService,
        ) {}
        
        async createNotification(title: string, text: string, type: NotificationType, studentId?: number, companyId?: number) {
        const notification = new Notification()
        notification.title = title;
        notification.text = text;
        notification.type = type;
        if (studentId != null) notification.studentId = studentId;
        if (companyId != null) notification.companyId = companyId;

        this.notificationRepository.save(notification)
    }
    
    async getNotifications(req: any) {
        let user = null;
        let notifications;
        if (req.user.userType == "USER_STUDENT") {
            user = await this.studentService.findOneByEmail(req.user.email);
            notifications = this.notificationRepository.findBy({studentId: user.id})
        } else if (req.user.userType == "USER_COMPANY") {
            user = await this.companyService.findOne(req.user.email);
            notifications = this.notificationRepository.findBy({companyId: user.id})
        }

        return notifications
    }
}
