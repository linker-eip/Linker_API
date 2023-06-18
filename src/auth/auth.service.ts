import { Injectable } from '@nestjs/common';
import { LoginStudentDto } from './dto/login-student.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { StudentService } from 'src/student/student.service';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { StudentUser } from 'src/entity/StudentUser.entity';
import * as bcrypt from 'bcrypt';
import { LoginCompanyDto } from './dto/login-company.dto';
import { CompanyService } from 'src/company/company.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { CompanyUser } from 'src/entity/CompanyUser.entity';
import { ForgetPasswordDto } from 'src/auth/dto/forget-password.dto';
import { SendMailDto } from 'src/mail/dto/send-mail.dto';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly studentService: StudentService,
    private readonly jwtService: JwtService,
    private readonly companyService: CompanyService,
    private readonly mailService: MailService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const bool = await bcrypt.compare(password, hashedPassword);
    return bool;
  }

  async registerStudent(registerStudentDto: RegisterStudentDto) {
    const { email, password, firstName, lastName } = registerStudentDto;

    const existingUser = await this.studentService.findOne(email);

    if (existingUser) {
      return { error: 'User with email ' + email + ' already exists' };
    }

    const newUser = new StudentUser();
    newUser.email = email;
    newUser.password = await this.hashPassword(password);
    newUser.firstName = firstName;
    newUser.lastName = lastName;

    const savedUser = await this.studentService.save(newUser);

    const token = jwt.sign({ email: savedUser.email }, process.env.JWT_SECRET);

    return { token };
  }

  async registerCompany(registerCompanyDto: RegisterCompanyDto) {
    const { email, password, name, phoneNumber } = registerCompanyDto;

    if (await this.companyService.findOne(email)) {
      return { error: 'User with email ' + email + ' already exists' };
    }

    if (await this.companyService.findOneByPhoneNumber(phoneNumber)) {
      return { error: 'User with number ' + phoneNumber + ' already exists' };
    }

    const newUser = new CompanyUser();
    newUser.email = email;
    newUser.password = await this.hashPassword(password);
    newUser.companyName = name;
    newUser.phoneNumber = phoneNumber;

    const savedUser = await this.companyService.save(newUser);

    const token = jwt.sign({ email: savedUser.email }, process.env.JWT_SECRET);

    return { token };
  }

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
  }

  async loginCompany(loginCompanyDto: LoginCompanyDto) {
    const company = await this.companyService.findOne(loginCompanyDto.email);

    if (!company) {
      return {
        error: 'User with email ' + loginCompanyDto.email + ' does not exist',
      };
    }
    if (
      await this.comparePassword(loginCompanyDto.password, company.password)
    ) {
      const token = jwt.sign({ email: company.email }, process.env.JWT_SECRET);
      return { token };
    }
    return null;
  }

  async generateCompanyResetPassword(body: ForgetPasswordDto) {
    const company = await this.companyService.findOne(body.email);
    if (!company) {
      return { error: 'User with email ' + body.email + ' does not exist' };
    }
    const randomString = [...Array(16)]
      .map(() => Math.random().toString(36)[2])
      .join('');
    company.resetPasswordToken = randomString;
    const emailBody =
      'Voici votre clé pour réinitialiser votre mot de passe : ' + randomString;
    const emailSubject = 'Réinitialisation de mot de passe';

    const sendMailDto = new SendMailDto();
    sendMailDto.to = company.email;
    sendMailDto.subject = emailSubject;
    sendMailDto.text = emailBody;
    this.mailService.sendMail(sendMailDto);
    await this.companyService.save(company);
    return { token: company.resetPasswordToken };
  }

  async resetCompanyPassword(body: ResetPasswordDto) {
    if (!body.token) {
      return { error: 'Token is required' };
    }
    const company = await this.companyService.findOneByResetPasswordToken(
      body.token,
    );
    if (!company) {
      return { error: 'User with token ' + body.token + ' does not exist' };
    }
    company.password = await this.hashPassword(body.password);
    company.resetPasswordToken = null;
    this.companyService.save(company);
    return { message: 'Password reset successfully' };
  }

  async generateStudentResetPassword(body: ForgetPasswordDto) {
    const student = await this.studentService.findOne(body.email);
    if (!student) {
      return { error: 'User with email ' + body.email + ' does not exist' };
    }
    const randomString = [...Array(16)]
      .map(() => Math.random().toString(36)[2])
      .join('');
    student.resetPasswordToken = randomString;
    const emailBody =
      'Voici votre clé pour réinitialiser votre mot de passe : ' + randomString;
    const emailSubject = 'Réinitialisation de mot de passe';

    const sendMailDto = new SendMailDto();
    sendMailDto.to = student.email;
    sendMailDto.subject = emailSubject;
    sendMailDto.text = emailBody;
    this.mailService.sendMail(sendMailDto);
    await this.studentService.save(student);
    return { token: student.resetPasswordToken };
  }

  async resetStudentPassword(body: ResetPasswordDto) {
    const student = await this.studentService.findOneByResetPasswordToken(
      body.token,
    );
    if (!student) {
      return { error: 'User with token ' + body.token + ' does not exist' };
    }
    student.password = await this.hashPassword(body.password);
    student.resetPasswordToken = null;
    this.studentService.save(student);
    return { message: 'Password reset successfully' };
  }
}
