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

    async findStudentProfile(email: string): Promise<StudentProfile>
    {
        const profile = this.studentProfileRepository.findOne({where: {email}});
        if (profile)
            return profile;
        throw new Error (`Could not find student profile`)
    }

    async updateStudentProfile(CreateStudentProfile: CreateStudentProfileDto, req: any) {
        const user = await this.studentRepository.findOne({where: {email: req.email}})
        if (!user) throw new Error (`Could not find student profile`);
        let studentProfile = await this.studentProfileRepository.findOne({where: {email: req.email}});
        if (!studentProfile) {
            studentProfile = new StudentProfile();
        }
        studentProfile.studentId = user.id
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
