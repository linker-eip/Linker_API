import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginStudentDto } from './dto/login-student.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { StudentService } from '../student/student.service';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginCompanyDto } from './dto/login-company.dto';
import { CompanyService } from '../company/company.service';
import { RegisterCompanyDto, RegisterCompanyV2Dto } from './dto/register-company.dto';
import { CompanyUser } from '../company/entity/CompanyUser.entity';
import { ForgetPasswordDto } from '../auth/dto/forget-password.dto';
import { SendMailDto } from '../mail/dto/send-mail.dto';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GoogleLoginDto, GoogleLoginTokenDto } from './dto/google-login.dto';
import { google } from 'googleapis';
import axios from 'axios';
import { StudentUser } from '../student/entity/StudentUser.entity';
import { GoogleApiService } from './services/google-api-services';
import * as crypto from 'crypto';
import { SiretService } from 'src/siret/siret.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly studentService: StudentService,
    private readonly jwtService: JwtService,
    private readonly companyService: CompanyService,
    private readonly mailService: MailService,
    private readonly googleApiService: GoogleApiService,
    private readonly siretService: SiretService,
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

    const existingUser = await this.studentService.findOneByEmail(email);

    if (existingUser) {
      throw new HttpException("Un compte utilisant cette adresse e-mail existe déjà.", HttpStatus.UNAUTHORIZED)
    }

    const newUser = new StudentUser();
    newUser.email = email;
    newUser.password = await this.hashPassword(password);
    newUser.firstName = firstName;
    newUser.lastName = lastName;

    const randomBytes = crypto.randomBytes(Math.ceil(32 / 2));
    newUser.verificationKey = randomBytes.toString('hex').slice(0, 32);

    const savedUser = await this.studentService.save(newUser);

    const token = jwt.sign({ email: savedUser.email, userType: "USER_STUDENT" }, process.env.JWT_SECRET);

    await this.studentService.updateStudentProfile(
      null,
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

    const sendMailDto = new SendMailDto();
    sendMailDto.to = savedUser.email
    sendMailDto.subject = 'Verification de compte Linker'
    sendMailDto.text = 'Veuillez vérifier votre compte Linker : ' + process.env.FRONT_URL + '/auth/verify/' + savedUser.verificationKey
    this.mailService.sendMail(sendMailDto)

    return { token };
  }

  async verifyStudent(code: string) {
    const student = await this.studentService.findOneByVerificationKey(code);
    if (!student) {
      throw new HttpException('Code de vérification invalide', HttpStatus.NOT_FOUND)
    }

    student.verificationKey = null
    student.isVerified = true
    this.studentService.save(student)
  }

  async registerCompany(registerCompanyDto: RegisterCompanyDto) {
    const { email, password, name, phoneNumber } = registerCompanyDto;

    if (await this.companyService.findOne(email)) {
      throw new HttpException('Un compte utilisant cette adresse e-mail existe déjà.', HttpStatus.UNAUTHORIZED)
    }

    if (await this.companyService.findOneByPhoneNumber(phoneNumber)) {
      throw new HttpException('Un compte utilisant ce numéro de téléphone existe déjà.', HttpStatus.UNAUTHORIZED)
    }

    const newUser = new CompanyUser();
    newUser.email = email;
    newUser.password = await this.hashPassword(password);
    newUser.companyName = name;
    newUser.phoneNumber = phoneNumber;

    const savedUser = await this.companyService.save(newUser);

    const token = jwt.sign({ email: savedUser.email, userType: "USER_COMPANY" }, process.env.JWT_SECRET);

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
        picture: null,
      },
      savedUser,
    );


    return { token };
  }

  async registerCompanyv2(registerCompanyDto: RegisterCompanyV2Dto) {
    const { email, password, siret, phoneNumber } = registerCompanyDto;

    if (await this.companyService.findOne(email)) {
      throw new HttpException('Un compte utilisant cette adresse e-mail existe déjà.', HttpStatus.UNAUTHORIZED)
    }

    if (await this.companyService.findOne(email)) {
      throw new HttpException('Un compte utilisant cette adresse e-mail existe déjà.', HttpStatus.UNAUTHORIZED)
    }

    if (await this.companyService.findOneByPhoneNumber(phoneNumber)) {
      throw new HttpException('Un compte utilisant ce numéro de téléphone existe déjà.', HttpStatus.UNAUTHORIZED)
    }

    let companyInfos;

    try {
      companyInfos = await this.siretService.searchCompanyFromSiret(registerCompanyDto.siret);
    } catch (err) {
      throw new HttpException('SIRET invalide', HttpStatus.BAD_REQUEST);
    }


    const newUser = new CompanyUser();
    newUser.email = email;
    newUser.password = await this.hashPassword(password);
    newUser.companyName = companyInfos.uniteLegale.nomUniteLegale
    newUser.phoneNumber = phoneNumber;

    const savedUser = await this.companyService.save(newUser);

    const token = jwt.sign({ email: savedUser.email, userType: "USER_COMPANY" }, process.env.JWT_SECRET);

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
        picture: null,
      },
      savedUser,
    );


    return { token };
  }

  async loginStudent(loginStudentDto: LoginStudentDto) {
    const student = await this.studentService.findOneByEmail(loginStudentDto.email);

    if (!student) {
      return {
        error: "Il n'existe pas de compte associé à l'e-mail " + loginStudentDto.email
      };
    }

    if (
      await this.comparePassword(loginStudentDto.password, student.password)
    ) {
      const token = jwt.sign({ email: student.email, userType: "USER_STUDENT" }, process.env.JWT_SECRET);
      return { token };
    }

    return null;
  }

  async loginCompany(loginCompanyDto: LoginCompanyDto) {
    const company = await this.companyService.findOne(loginCompanyDto.email);

    if (!company) {
      return {
        error: "Il n'existe pas de compte associé à l'e-mail " + loginCompanyDto.email
      };
    }
    if (
      await this.comparePassword(loginCompanyDto.password, company.password)
    ) {
      const token = jwt.sign({ email: company.email, userType: "USER_COMPANY" }, process.env.JWT_SECRET);
      return { token };
    }
    return null;
  }

  async generateCompanyResetPassword(body: ForgetPasswordDto) {
    const company = await this.companyService.findOne(body.email);
    if (!company) {
      return { error: "Il n'existe pas de compte associé à l'adresse e-mail " + body.email};
    }

    const randomString = Math.random().toString(36).substring(2, 8);


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
    return ;
  }

  async resetCompanyPassword(body: ResetPasswordDto) {
    if (!body.token) {
      return { error: 'Token is required' };
    }
    const company = await this.companyService.findOneByResetPasswordToken(
      body.token,
    );
    if (!company) {
      return { error: 'Jeton de réinitialisation invalide'};
    }
    company.password = await this.hashPassword(body.password);
    company.resetPasswordToken = null;
    this.companyService.save(company);
    return { message: 'Mot de passe rénitialisé avec succès' };
  }

  async generateStudentResetPassword(body: ForgetPasswordDto) {
    const student = await this.studentService.findOneByEmail(body.email);
    if (!student) {
      return { error: "Il n'existe pas de compte associé à l'adresse e-mail " + body.email};
    }
    const randomString = Math.random().toString(36).substring(2, 8);

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
    return;
  }

  async resetStudentPassword(body: ResetPasswordDto) {
    const student = await this.studentService.findOneByResetPasswordToken(
      body.token,
    );
    if (!student) {
      return { error: 'Jeton de réinitialisation invalide'};
    }
    student.password = await this.hashPassword(body.password);
    student.resetPasswordToken = null;
    this.studentService.save(student);
    return { message: 'Mot de passe rénitialisé avec succès' };
  }

  async googleStudentLoginWithCode(googleLoginDto: GoogleLoginDto) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:8080/test',
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
    const existingUser = await this.studentService.findOneByEmail(
      userinfos.data.email,
    );

    if (existingUser) {
      const token = jwt.sign(
        { email: existingUser.email, userType: "USER_STUDENT" },
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
        { email: savedUser.email, userType: "USER_STUDENT" },
        process.env.JWT_SECRET,
      );

      await this.studentService.updateStudentProfile(
        null,
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
  }

  async googleStudentLoginWithToken(googleLoginTokenDto: GoogleLoginTokenDto) {
    const userinfos = await this.googleApiService.getPersonFromAccessToken(
      googleLoginTokenDto.token,
    );

    const existingUser = await this.studentService.findOneByEmail(userinfos.email);

    if (existingUser) {
      const token = jwt.sign(
        { email: existingUser.email, userType: "USER_STUDENT" },
        process.env.JWT_SECRET,
      );
      return { token };
    } else {
      const newUser = new StudentUser();
      newUser.email = userinfos.email;
      newUser.password = await this.hashPassword(googleLoginTokenDto.token);
      newUser.firstName = userinfos.given_name;
      newUser.lastName = userinfos.family_name;

      const savedUser = await this.studentService.save(newUser);

      const token = jwt.sign(
        { email: savedUser.email, userType: "USER_STUDENT" },
        process.env.JWT_SECRET,
      );

      await this.studentService.updateStudentProfile(
        null,
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
  }

  async googleCompanyLoginWithCode(googleLoginDto: GoogleLoginDto) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:8080/test',
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
    const existingUser = await this.companyService.findOne(
      userinfos.data.email,
    );

    if (existingUser) {
      const token = jwt.sign(
        { email: existingUser.email, userType: "USER_COMPANY" },
        process.env.JWT_SECRET,
      );
      return { token };
    } else {
      const newUser = new CompanyUser();
      newUser.email = userinfos.data.email;
      newUser.password = await this.hashPassword(tokens.id_token);
      newUser.companyName = userinfos.data.given_name + ' ' + userinfos.data.family_name;
      newUser.phoneNumber = '+33';

      const savedUser = await this.companyService.save(newUser);

      const token = jwt.sign(
        { email: savedUser.email, userType: "USER_COMPANY" },
        process.env.JWT_SECRET,
      );

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
          picture: null,
        },
        savedUser,
      );

      return { token };
    }
  }

  async googleCompanyLoginWithToken(googleLoginTokenDto: GoogleLoginTokenDto) {
    const userinfos = await this.googleApiService.getPersonFromAccessToken(
      googleLoginTokenDto.token,
    );

    const existingUser = await this.companyService.findOne(userinfos.email);

    if (existingUser) {
      const token = jwt.sign(
        { email: existingUser.email, userType: "USER_COMPANY" },
        process.env.JWT_SECRET,
      );
      return { token };
    } else {
      const newUser = new CompanyUser();
      newUser.email = userinfos.email;
      newUser.password = await this.hashPassword(googleLoginTokenDto.token);
      newUser.companyName = userinfos.given_name + ' ' + userinfos.family_name;
      newUser.phoneNumber = '+33';

      const savedUser = await this.companyService.save(newUser);

      const token = jwt.sign(
        { email: savedUser.email, userType: "USER_COMPANY" },
        process.env.JWT_SECRET,
      );

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
          picture: null,
        },
        savedUser,
      );

      return { token };
    }
  }
}
