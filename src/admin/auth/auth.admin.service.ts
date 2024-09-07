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

@Injectable()
export class AuthAdminService {
  constructor(private readonly adminService: AdminService,
              @InjectRepository(StudentUser)
              private readonly studentRepository: Repository<StudentUser>,
              @InjectRepository(CompanyUser)
              private readonly companyRepository: Repository<CompanyUser>) {
  }

  async loginAdmin(body: LoginAminDto): Promise<LoginAdminResponseDto> {
    const adminUser = await this.adminService.findOneAdminByEmail(body.email);
    if (!adminUser) {
      throw new HttpException(
        'Mot de passe incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (body.password === adminUser.password) {
      const token = jwt.sign(
        { email: adminUser.email, userType: 'USER_ADMIN' },
        process.env.JWT_SECRET,
      );
      return { token };
    }
    return null;
  }

  async blockUser(userType: UserType, userId: number) {
    if (userType == UserType.STUDENT_USER) {
      const student = await this.studentRepository.findOne({ where: { id: userId } });
      if (student == null) {
        throw new HttpException(
          'Utilisateur introuvable',
          HttpStatus.NOT_FOUND,
        );
      }
      student.isBlocked = !student.isBlocked;
      await this.studentRepository.save(student);
      return student.isBlocked;
    } else {
      const company = await this.companyRepository.findOne({ where: { id: userId } });
      if (company == null) {
        throw new HttpException(
          'Utilisateur introuvable',
          HttpStatus.NOT_FOUND,
        );
      }
      company.isBlocked = !company.isBlocked;
      await this.companyRepository.save(company);
      return company.isBlocked;
    }
  }
}
