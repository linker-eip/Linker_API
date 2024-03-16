import { Injectable } from '@nestjs/common';
import { NotificationType, Notification } from './entity/Notification.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StudentService } from '../student/student.service';
import { CompanyService } from '../company/company.service';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import { StudentPreferences } from 'src/student/entity/StudentPreferences.entity';
import { MailService } from 'src/mail/mail.service';
import { SendMailDto } from 'src/mail/dto/send-mail.dto';
import { CompanyPreferences } from 'src/company/entity/CompanyPreferences.entity';

@Injectable()
export class NotificationsService {

    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
        @InjectRepository(StudentPreferences)
        private studentPreferencesRepository: Repository<StudentPreferences>,
        @InjectRepository(CompanyPreferences)
        private companyPreferencesRepository: Repository<CompanyPreferences>,
        private readonly studentService: StudentService,
        private readonly mailService: MailService,
        private readonly companyService: CompanyService,
    ) { }

    async createNotification(title: string, text: string, type: NotificationType, studentId?: number, companyId?: number) {
        const notification = new Notification()
        notification.title = title;
        notification.text = text;
        notification.type = type;
        if (studentId != null) {
            notification.studentId = studentId;
            const studentPref = await this.studentPreferencesRepository.findOne({ where: { studentId: studentId } })
            const student = await this.studentService.findOneById(studentId)
            if ((type == NotificationType.DOCUMENT && studentPref.mailNotifDocument)
                || (type == NotificationType.GROUP && studentPref.mailNotifGroup)
                || (type == NotificationType.MESSAGE && studentPref.mailNotifMessage)
                || (type == NotificationType.MISSION && studentPref.mailNotifMission)) {
                const mailDto = new SendMailDto()
                mailDto.subject = "Nouvelle notification Linker : " + title
                mailDto.text = "Vous avez reçu une nouvelle notification sur votre compte Linker. \n\n" + text
                mailDto.to = student.email
                this.mailService.sendMail(mailDto)
            }
        }
        if (companyId != null) {
            notification.companyId = companyId;
            const companypref = await this.companyPreferencesRepository.findOne({ where: { companyId: companyId } })
            const company = await this.companyService.findCompanyById(companyId)
            if ((type == NotificationType.DOCUMENT && companypref.mailNotifDocument)
                || (type == NotificationType.MESSAGE && companypref.mailNotifMessage)
                || (type == NotificationType.MISSION && companypref.mailNotifMission)) {
                const mailDto = new SendMailDto()
                mailDto.subject = "Nouvelle notification Linker : " + title
                mailDto.text = "Vous avez reçu une nouvelle notification sur votre compte Linker. \n\n" + text
                mailDto.to = company.email
                this.mailService.sendMail(mailDto)
                }
        }

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

    async updateNotificationsStatus(req: any, dto: UpdateNotificationsDto) {
        let user = null;
        let notifications = await this.notificationRepository.findBy({ id: In(dto.ids) });

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
