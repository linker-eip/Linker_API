import { Injectable } from '@nestjs/common';
import { NotificationType, Notification } from './entity/Notification.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {

    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
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
}
