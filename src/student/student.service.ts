import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentUser } from './entity/StudentUser.entity';
import { StudentProfile } from './entity/StudentProfile.entity';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentUser)
    private studentRepository: Repository<StudentUser>,
    @InjectRepository(StudentProfile)
    private studentProfileRepository: Repository<StudentProfile>,
  ) {}

  async findAll(): Promise<StudentUser[]> {
    return this.studentRepository.find();
  }

  async findOne(email: string): Promise<StudentUser | undefined> {
    return this.studentRepository.findOne({ where: { email } });
  }

  async findOneByResetPasswordToken(
    token: string,
  ): Promise<StudentUser | undefined> {
    return this.studentRepository.findOne({
      where: { resetPasswordToken: token },
    });
  }
  async save(student: StudentUser): Promise<StudentUser> {
    return this.studentRepository.save(student);
  }

  async findStudentProfile(email: string): Promise<StudentProfile> {
    const profile = this.studentProfileRepository.findOne({ where: { email } });
    if (profile) return profile;
    throw new Error(`Could not find student profile`);
  }

  async updateStudentProfile(
    CreateStudentProfile: CreateStudentProfileDto,
    req: any,
  ) {
    const user = await this.studentRepository.findOne({
      where: { email: req.email },
    });

    if (!user) {
      throw new Error(`Could not find student profile`);
    }

    let studentProfile = await this.studentProfileRepository.findOne({
      where: { email: req.email },
    });

    if (!studentProfile) {
      studentProfile = new StudentProfile();
      studentProfile.studentId = user.id;
      studentProfile.email = user.email;
    }

    if (CreateStudentProfile.name !== null) {
      studentProfile.name = CreateStudentProfile.name;
    }

    if (CreateStudentProfile.description !== null) {
      studentProfile.description = CreateStudentProfile.description;
    }

    if (CreateStudentProfile.phone !== null) {
      studentProfile.phone = CreateStudentProfile.phone;
    }

    if (CreateStudentProfile.location !== null) {
      studentProfile.location = CreateStudentProfile.location;
    }

    if (CreateStudentProfile.studies !== null) {
      studentProfile.studies = CreateStudentProfile.studies;
    }

    if (CreateStudentProfile.skills !== null) {
      studentProfile.skills = CreateStudentProfile.skills;
    }

    if (CreateStudentProfile.website !== null) {
      studentProfile.website = CreateStudentProfile.website;
    }

    await this.studentProfileRepository.save(studentProfile);

    return studentProfile;
  }
}
