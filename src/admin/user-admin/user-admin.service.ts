import { ConflictException, Injectable } from '@nestjs/common';
import { StudentSearchOptionAdminDto } from './dto/student-search-option-admin.dto';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, SelectQueryBuilder } from 'typeorm';
import { CreateStudentProfileDto } from '../../student/dto/create-student-profile.dto';
import { StudentProfile } from '../../student/entity/StudentProfile.entity';
import { hashPassword } from '../utils/utils';
import { RegisterStudentAdminDto } from './dto/register-student-admin.dto';
import { UpdateStudentAdminDto } from './dto/update-student-admin.dto';
import { CompanySearchOptionAdminDto } from './dto/company-search-option-admin.dto';
import { CompanyUser } from '../../company/entity/CompanyUser.entity';
import { CompanyProfile } from '../../company/entity/CompanyProfile.entity';
import { RegisterCompanyAdminDto } from './dto/register-company-admin.dto';
import { CreateCompanyProfileDto } from '../../company/dto/create-company-profile.dto';
import { UpdateCompanyAdminDto } from './dto/update-company-admin.dto';

@Injectable()
export class UserAdminService {
  constructor(
    @InjectRepository(StudentUser)
    private readonly studentUserRepository: Repository<StudentUser>,
    @InjectRepository(StudentProfile)
    private readonly studentProfileRepository: Repository<StudentProfile>,
    @InjectRepository(CompanyUser)
    private readonly companyUserRepository: Repository<CompanyUser>,
    @InjectRepository(CompanyProfile)
    private readonly companyProfileRepository: Repository<CompanyProfile>,
  ) {}

  //STUDENTS
  async findAllStudents(
    searchOption: StudentSearchOptionAdminDto,
  ): Promise<StudentUser[]> {
    const { searchString } = searchOption;

    let studentsQuery: SelectQueryBuilder<StudentUser> =
      this.studentUserRepository.createQueryBuilder('studentUser');

    studentsQuery = studentsQuery.andWhere(
      new Brackets((qb) => {
        if (searchString && searchString.trim().length > 0) {
          const searchParams = searchString
            .trim()
            .split(',')
            .map((elem) => elem.trim());

          searchParams.forEach((searchParam, index) => {
            const emailSearch = `emailSearch${index}`;
            const firstNameSearch = `firstNameSearch${index}`;
            const lastNameSearch = `lastNameSearch${index}`;

            qb.orWhere(`studentUser.email LIKE :${emailSearch}`, {
              [emailSearch]: `%${searchParam}%`,
            });
            qb.orWhere(`studentUser.firstName LIKE :${firstNameSearch}`, {
              [firstNameSearch]: `%${searchParam}%`,
            });
            qb.orWhere(`studentUser.lastName LIKE :${lastNameSearch}`, {
              [lastNameSearch]: `%${searchParam}%`,
            });
          });
        }
        if (searchOption.isActive) {
          qb.andWhere('studentUser.isActive = :isActive', {
            isActive: searchOption.isActive,
          });
        }

        if (searchOption.lastName) {
          qb.andWhere('studentUser.lastName = :lastName', {
            lastName: searchOption.lastName,
          });
        }

        if (searchOption.firstName) {
          qb.andWhere('studentUser.firstName = :firstName', {
            firstName: searchOption.firstName,
          });
        }

        if (searchOption.email) {
          qb.andWhere('studentUser.email = :email', {
            email: searchOption.email,
          });
        }
      }),
    );

    const students = await studentsQuery.getMany();
    return students;
  }

  async findOneStudent(email: string): Promise<StudentUser> {
    const student = await this.studentUserRepository.findOne({
      where: { email },
    });
    return student;
  }

  async save(student: StudentUser): Promise<StudentUser> {
    return this.studentUserRepository.save(student);
  }

  async createStudent(body: RegisterStudentAdminDto): Promise<StudentUser> {
    const { email, password, firstName, lastName } = body;

    const existingUser = await this.findOneStudent(email);

    if (existingUser) throw new ConflictException('Student already exists');

    const newUser = new StudentUser();
    newUser.email = email;
    newUser.password = await hashPassword(password);
    newUser.firstName = firstName;
    newUser.lastName = lastName;

    const savedUser = await this.save(newUser);

    await this.updateStudentProfile(
      {
        name: savedUser.firstName + ' ' + savedUser.lastName,
        description: '',
        email: savedUser.email,
        phone: '',
        location: '',
        studies: [],
        skills: [],
        jobs: [],
        website: '',
      },
      savedUser.email,
    );

    return savedUser;
  }

  async updateStudentProfile(
    CreateStudentProfile: CreateStudentProfileDto,
    req: any,
  ) {
    const user = await this.studentUserRepository.findOne({
      where: { email: req },
    });
    if (!user) throw new Error(`Could not find student profile`);
    let studentProfile = await this.studentProfileRepository.findOne({
      where: { email: req },
    });
    if (!studentProfile) {
      studentProfile = new StudentProfile();
    }
    studentProfile.studentId = user.id;
    studentProfile.name = CreateStudentProfile.name;
    studentProfile.description = CreateStudentProfile.description;
    studentProfile.email = user.email;
    studentProfile.phone = CreateStudentProfile.phone;
    studentProfile.location = CreateStudentProfile.location;
    studentProfile.studies = CreateStudentProfile.studies;
    studentProfile.skills = CreateStudentProfile.skills;
    studentProfile.website = CreateStudentProfile.website;
    return this.studentProfileRepository.save(studentProfile);
  }

  async findOneStudentById(studentId: number): Promise<StudentUser> {
    const student = await this.studentUserRepository.findOne({
      where: { id: studentId },
    });
    return student;
  }

  async updateStudent(
    student: StudentUser,
    body: UpdateStudentAdminDto,
  ): Promise<StudentUser> {
    if (body.email) {
      const studentWithSameEmail = await this.findOneStudent(body.email);
      if (studentWithSameEmail)
        throw new ConflictException('Student already exists');
    }
    const update: Partial<StudentUser> = {};

    if (body.email) update.email = body.email;
    if (body.password) update.password = await hashPassword(body.password);
    if (body.firstName) update.firstName = body.firstName;
    if (body.lastName) update.lastName = body.lastName;
    if (body.isActive) update.isActive = body.isActive;

    return this.studentUserRepository.update(student.id, update).then(() => {
      return this.findOneStudentById(student.id);
    });
  }

  async deleteStudent(student: StudentUser) {
    return this.studentUserRepository.delete(student.id);
  }

  //COMPANIES

  async findAllCompanies(
    searchOption: CompanySearchOptionAdminDto,
  ): Promise<CompanyUser[]> {
    const { searchString } = searchOption;

    let companiesQuery: SelectQueryBuilder<CompanyUser> =
      this.companyUserRepository.createQueryBuilder('companyUser');

    companiesQuery = companiesQuery.andWhere(
      new Brackets((qb) => {
        if (searchString && searchString.trim().length > 0) {
          const searchParams = searchString
            .trim()
            .split(',')
            .map((elem) => elem.trim());

          searchParams.forEach((searchParam, index) => {
            const emailSearch = `emailSearch${index}`;
            const companyName = `companyName${index}`;

            qb.orWhere(`companyUser.email LIKE :${emailSearch}`, {
              [emailSearch]: `%${searchParam}%`,
            });
            qb.orWhere(`companyUser.companyName LIKE :${companyName}`, {
              [companyName]: `%${searchParam}%`,
            });
          });
        }
        if (searchOption.isActive) {
          qb.andWhere('companyUser.isActive = :isActive', {
            isActive: searchOption.isActive,
          });
        }
        if (searchOption.email) {
          qb.andWhere('companyUser.email = :email', {
            email: searchOption.email,
          });
        }

        if (searchOption.companyName) {
          qb.andWhere('companyUser.companyName = :companyName', {
            companyName: searchOption.companyName,
          });
        }

        if (searchOption.phoneNumber) {
          qb.andWhere('companyUser.phoneNumber = :phoneNumber', {
            phoneNumber: searchOption.phoneNumber,
          });
        }
      }),
    );

    const companies = await companiesQuery.getMany();
    return companies;
  }

  async findOneCompany(email: string): Promise<CompanyUser> {
    const company = await this.companyUserRepository.findOne({
      where: { email },
    });
    return company;
  }

  async saveCompany(company: CompanyUser): Promise<CompanyUser> {
    return this.companyUserRepository.save(company);
  }

  async updateCompanyProfile(
    CreateCompanyProfile: CreateCompanyProfileDto,
    req: any,
  ) {
    const user = await this.companyUserRepository.findOne({
      where: { email: req },
    });
    if (!user) throw new Error(`Could not find company profile`);
    let companyProfile = await this.companyProfileRepository.findOne({
      where: { email: req },
    });
    if (!companyProfile) {
      companyProfile = new CompanyProfile();
    }
    companyProfile.companyId = user.id;
    companyProfile.name = CreateCompanyProfile.name;
    companyProfile.description = CreateCompanyProfile.description;
    companyProfile.email = user.email;
    companyProfile.phone = CreateCompanyProfile.phone;
    companyProfile.address = CreateCompanyProfile.address;
    companyProfile.size = CreateCompanyProfile.size;
    companyProfile.location = CreateCompanyProfile.location;
    companyProfile.activity = CreateCompanyProfile.activity;
    companyProfile.speciality = CreateCompanyProfile.speciality;
    companyProfile.website = CreateCompanyProfile.website;
    return this.companyProfileRepository.save(companyProfile);
  }

  async createCompany(body: RegisterCompanyAdminDto): Promise<CompanyUser> {
    const { email, password, companyName, phoneNumber } = body;

    const existingUser = await this.findOneCompany(email);

    if (existingUser) throw new ConflictException('Company already exists');

    const newUser = new CompanyUser();
    newUser.email = email;
    newUser.password = await hashPassword(password);
    newUser.companyName = companyName;
    newUser.phoneNumber = phoneNumber;

    const savedUser = await this.saveCompany(newUser);

    await this.updateCompanyProfile(
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
      savedUser.email,
    );

    return savedUser;
  }

  async findOneCompanyById(companyId: number): Promise<CompanyUser> {
    const company = await this.companyUserRepository.findOne({
      where: { id: companyId },
    });
    return company;
  }

  async updateCompany(
    company: CompanyUser,
    body: UpdateCompanyAdminDto,
  ): Promise<CompanyUser> {
    if (body.email) {
      const companyWithSameEmail = await this.findOneCompany(body.email);
      if (companyWithSameEmail)
        throw new ConflictException('Company already exists');
    }
    const update: Partial<CompanyUser> = {};

    if (body.email) update.email = body.email;
    if (body.password) update.password = await hashPassword(body.password);
    if (body.companyName) update.companyName = body.companyName;
    if (body.isActive) update.isActive = body.isActive;
    if (body.phoneNumber) update.phoneNumber = body.phoneNumber;
    if (body.picture) update.picture = body.picture;
    if (body.companyPicture) update.companyPicture = body.companyPicture;

    return this.companyUserRepository.update(company.id, update).then(() => {
      return this.findOneCompanyById(company.id);
    });
  }

  async deleteCompany(company: CompanyUser) {
    return this.companyUserRepository.delete(company.id);
  }
}
