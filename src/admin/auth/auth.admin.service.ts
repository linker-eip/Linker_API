import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAdminResponseDto } from './dto/login-admin-response.dto';
import { LoginAminDto } from './dto/login-admin.dto';
import { AdminService } from '../admin.service';
import * as jwt from 'jsonwebtoken';
import { comparePassword } from '../utils/utils';
//compare from utils


@Injectable()
export class AuthAdminService {
    constructor(
        private readonly adminService: AdminService,
    ) {}


    /*
    async loginStudent(loginStudentDto: LoginStudentDto) {
    const student = await this.studentService.findOne(loginStudentDto.email);

    if (!student) {
      return {
        error: 'User with email ' + loginStudentDto.email + ' does not exist',
      };
    }

    if (
      await this.comparePassword(loginStudentDto.password, student.password)
    ) {
      const token = jwt.sign({ email: student.email }, process.env.JWT_SECRET);
      return { token };
    }

    return null;
  }*/

    async loginAdmin(body : LoginAminDto ): Promise<LoginAdminResponseDto> {
        const adminUser = await this.adminService.findOneAdminByEmail(body.email);
        if (!adminUser) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        if (body.password === adminUser.password) {
            const token = jwt.sign({ email : adminUser.email}, process.env.JWT_SECRET);
            return { token };
        }
        return null;
    }
}
