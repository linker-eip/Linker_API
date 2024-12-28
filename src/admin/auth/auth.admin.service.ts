import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAdminResponseDto } from './dto/login-admin-response.dto';
import { LoginAminDto } from './dto/login-admin.dto';
import { AdminService } from '../admin.service';
import * as jwt from 'jsonwebtoken';
import { UserType } from '../../chat/entity/Message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { Repository } from 'typeorm';
import { CompanyUser } from '../../company/entity/CompanyUser.entity';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationType } from '../../notifications/entity/Notification.entity';

@Injectable()
export class AuthAdminService {
  constructor(
    private readonly adminService: AdminService,
    @InjectRepository(StudentUser)
    private readonly studentRepository: Repository<StudentUser>,
    @InjectRepository(CompanyUser)
    private readonly companyRepository: Repository<CompanyUser>,
    private readonly notificationsService: NotificationsService,
  ) {
  }

  async loginAdmin(body: LoginAminDto): Promise<LoginAdminResponseDto> {
    const adminUser = await this.adminService.findOneAdminByEmail(body.email);
    if (!adminUser) {
      throw new HttpException(
        'Mot de passe incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (await bcrypt.compare(body.password, adminUser.password)) {
      const token = jwt.sign(
        { email: adminUser.email, userType: 'USER_ADMIN' },
        process.env.JWT_SECRET,
      );
      return { token };
    }
    throw new HttpException(
      'Mot de passe incorrect',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async blockUser(
    userType: UserType,
    userId: number,
    body: { reason?: string },
  ) {
    if (userType == UserType.STUDENT_USER) {
      const student = await this.studentRepository.findOne({
        where: { id: userId },
      });
      if (student == null) {
        throw new HttpException(
          'Utilisateur introuvable',
          HttpStatus.NOT_FOUND,
        );
      }
      student.isBlocked = !student.isBlocked;
      await this.studentRepository.save(student);
      if (student.isBlocked)
        await this.notificationsService.createNotification(
          'Votre compte a été bloqué',
          'Your account has been blocked.',
          'Votre compte Linker à été bloqué.\n' +
          body.reason +
          '\n Pour plus d\'informations, veuillez contacter le support',
          'Your Linker account has been blocked.\n' +
          body.reason +
          '\n For more information, please contact support',
          NotificationType.ACCOUNT,
          student.id,
        );
      return student.isBlocked;
    } else {
      const company = await this.companyRepository.findOne({
        where: { id: userId },
      });
      if (company == null) {
        throw new HttpException(
          'Utilisateur introuvable',
          HttpStatus.NOT_FOUND,
        );
      }
      company.isBlocked = !company.isBlocked;
      await this.companyRepository.save(company);
      if (company.isBlocked)
        await this.notificationsService.createNotification(
          'Votre compte a été bloqué',
          'Your account has been blocked.',
          'Votre compte Linker à été bloqué.\n' +
          body.reason +
          '\n Pour plus d\'informations, veuillez contacter le support',
          'Your Linker account has been blocked.\n' +
          body.reason +
          '\n For more information, please contact support',
          NotificationType.ACCOUNT,
          null,
          company.id,
        );
      return company.isBlocked;
    }
  }
}
