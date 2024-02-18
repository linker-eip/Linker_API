import { Injectable } from '@nestjs/common';
import { NotificationType, Notification } from './entity/Notification.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StudentService } from '../student/student.service';
import { CompanyService } from '../company/company.service';

@Injectable()
export class NotificationsService {

    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,

        private readonly studentService: StudentService,
        private readonly companyService: CompanyService,
    ) { }

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
            notifications = this.notificationRepository.findBy({ studentId: user.id, isDeleted: false })
        } else if (req.user.userType == "USER_COMPANY") {
            user = await this.companyService.findOne(req.user.email);
            notifications = this.notificationRepository.findBy({ companyId: user.id, isDeleted: false })
        }

        return notifications
    }

    async updateNotificationsStatus(req: any, ids: number[]) {
        console.log(req.user, ids);
        let user = null;
        let notifications = await this.notificationRepository.findBy({ id: In(ids) });

        if (req.user.userType == "USER_STUDENT") {
            user = await this.studentService.findOneByEmail(req.user.email);
            notifications.forEach(notif => {
                if (notif.studentId == user.id) {
                    notif.alreadySeen = true;
                }
            });
        } else if (req.user.userType == "USER_COMPANY") {
            user = await this.companyService.findOne(req.user.email);
            notifications.forEach(notif => {
                if (notif.companyId == user.id) {
                    notif.alreadySeen = true;
                }
            });
        }
        this.notificationRepository.save(notifications)
    }

    async deleteNotification(req: any, id: number) {
        let user = null;
        let notification = await this.notificationRepository.findOne({ where: { id: id } });

        if (req.user.userType == "USER_STUDENT") {
            user = await this.studentService.findOneByEmail(req.user.email);
            if (notification.studentId == user.id) {
                notification.isDeleted = true;
            };
        } else if (req.user.userType == "USER_COMPANY") {
            user = await this.companyService.findOne(req.user.email);
            if (notification.companyId == user.id) {
                notification.isDeleted = true;
            }
        }
        this.notificationRepository.save(notification)
    }
}
