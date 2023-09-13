import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginStudentDto } from './dto/login-student.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { StudentService } from 'src/student/student.service';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginCompanyDto } from './dto/login-company.dto';
import { CompanyService } from 'src/company/company.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { CompanyUser } from 'src/company/entity/CompanyUser.entity';
import { ForgetPasswordDto } from 'src/auth/dto/forget-password.dto';
import { SendMailDto } from 'src/mail/dto/send-mail.dto';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { google } from 'googleapis';
import { env } from 'process';
import axios from 'axios';
import { oauth2 } from 'googleapis/build/src/apis/oauth2';
import { StudentUser } from 'src/student/entity/StudentUser.entity';

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
      throw new HttpException('Email already registered', HttpStatus.UNAUTHORIZED)
    }

    const newUser = new StudentUser();
    newUser.email = email;
    newUser.password = await this.hashPassword(password);
    newUser.firstName = firstName;
    newUser.lastName = lastName;

    const savedUser = await this.studentService.save(newUser);

    const token = jwt.sign({ email: savedUser.email }, process.env.JWT_SECRET);

    await this.studentService.updateStudentProfile(
      {
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        description: '',
        email: savedUser.email,
        phone: '',
        location: '',
        picture: null,
        studies: [],
        skills: [],
        jobs: [],
        website: '',
      },
      savedUser
    );

    return { token };
  }

  async registerCompany(registerCompanyDto: RegisterCompanyDto) {
    const { email, password, name, phoneNumber } = registerCompanyDto;

    if (await this.companyService.findOne(email)) {
      throw new HttpException('Email already registered', HttpStatus.UNAUTHORIZED)
    }

    if (await this.companyService.findOneByPhoneNumber(phoneNumber)) {
      throw new HttpException('Phone number already registered', HttpStatus.UNAUTHORIZED)
    }

    const newUser = new CompanyUser();
    newUser.email = email;
    newUser.password = await this.hashPassword(password);
    newUser.companyName = name;
    newUser.phoneNumber = phoneNumber;

    const savedUser = await this.companyService.save(newUser);

    const token = jwt.sign({ email: savedUser.email }, process.env.JWT_SECRET);

    await this.companyService.updateCompanyProfile(
      {
        name: savedUser.companyName,
        description: '',
        email: savedUser.email,
        phone: savedUser.phoneNumber,
        address: '',
        size: 0,
        location: '',
        activity: '',
        speciality: '',
        website: '',
      },
      savedUser,
    );


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
      'Voici votre clé pour réinitialiser votre mot de passe : ' +
      randomString +
      '.\n Vous pouvez le réinitialiser sur https://linker-app.fr/company/reset-password';
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
      'Voici votre clé pour réinitialiser votre mot de passe : ' +
      randomString +
      '.\n Vous pouvez le réinitialiser sur https://linker-app.fr/student/reset-password';
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

  async googleLogin(googleLoginDto: GoogleLoginDto) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://localhost:8080/test',
    );

    // Generate Oauth2 Link (Keeping for later use)
    // const scopes = [
    //   "https://www.googleapis.com/auth/userinfo.email",
    //   "https://www.googleapis.com/auth/userinfo.profile"
    // ]
    // const authorizationUrl = oauth2Client.generateAuthUrl({
    //   access_type: 'offline',
    //   scope: scopes,
    //   include_granted_scopes: true
    // });
    // console.log(authorizationUrl)

    let tokens;
    try {
      tokens = await oauth2Client.getToken(googleLoginDto.code);
    } catch (e) {
      return { error: 'Invalid token' };
    }
    const userinfos = await axios.get(
      'https://oauth2.googleapis.com/tokeninfo?id_token=' +
        tokens.tokens.id_token,
    );
    const existingUser = await this.studentService.findOne(
      userinfos.data.email,
    );

    if (existingUser) {
      const token = jwt.sign(
        { email: existingUser.email },
        process.env.JWT_SECRET,
      );
      return { token };
    } else {
      const newUser = new StudentUser();
      newUser.email = userinfos.data.email;
      newUser.password = await this.hashPassword(tokens.id_token);
      newUser.firstName = userinfos.data.given_name;
      newUser.lastName = userinfos.data.family_name;

      const savedUser = await this.studentService.save(newUser);

      const token = jwt.sign(
        { email: savedUser.email },
        process.env.JWT_SECRET,
      );

      return { token };
    }
  }
}
