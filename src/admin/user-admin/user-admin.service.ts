import { ConflictException, Injectable } from '@nestjs/common';
import { StudentSearchOptionAdminDto } from './dto/student-search-option-admin.dto';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { CreateStudentProfileDto } from '../../student/dto/create-student-profile.dto';
import { StudentProfile } from '../../student/entity/StudentProfile.entity';
import { hashPassword } from '../utils/utils';
import { RegisterStudentAdminDto } from './dto/register-student-admin.dto';

@Injectable()
export class UserAdminService {
  constructor(
    @InjectRepository(StudentUser)
    private readonly studentUserRepository: Repository<StudentUser>,
    @InjectRepository(StudentProfile)
    private readonly studentProfileRepository: Repository<StudentProfile>,
  ) {}

  async findAllStudents(
    searchOption: StudentSearchOptionAdminDto,
  ): Promise<StudentUser[]> {
    const { searchString } = searchOption;

    let studentsQuery = this.studentUserRepository
      .createQueryBuilder('studentUser')
      .where(
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
        studies: '',
        skills: '',
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
      where: { email: req.email },
    });
    if (!user) throw new Error(`Could not find student profile`);
    let studentProfile = await this.studentProfileRepository.findOne({
      where: { email: req.email },
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
}
