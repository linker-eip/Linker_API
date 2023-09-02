import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentUser } from './entity/StudentUser.entity';
import { StudentProfile } from './entity/StudentProfile.entity';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { SkillsService } from './skills/skills.service';
import { StudentProfileResponseDto } from './dto/student-profile-response.dto';
import { JobsService } from './jobs/jobs.service';
import { StudiesService } from './studies/studies.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentUser)
    private studentRepository: Repository<StudentUser>,
    @InjectRepository(StudentProfile)
    private studentProfileRepository: Repository<StudentProfile>,
    private readonly skillsService: SkillsService,
    private readonly jobsservice: JobsService,
    private readonly studiesService: StudiesService
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

  async findStudentProfile(email: string) {
    const profile = await this.studentProfileRepository.findOne({ where: { email } });
    if (!profile) throw new Error(`Could not find student profile`);
    const skills = await this.skillsService.findSkills(profile.id);
    const jobs = await this.jobsservice.findJobs(profile.id);
    const studies = await this.studiesService.findStudies(profile.id);
    return {
      name: profile.name,
      description: profile.description,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      studies: studies,
      skills: skills,
      jobs: jobs,
      website: profile.website,
    };
    
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
      for (let i = 0; i < CreateStudentProfile?.studies?.length; i++) {
        await this.studiesService.addStudie(
          studentProfile,
          CreateStudentProfile.studies[i],
        );
      }
    }

    if (CreateStudentProfile.skills !== null) {
      for (let i = 0; i < CreateStudentProfile?.skills?.length; i++) {
        await this.skillsService.addSkill(
          studentProfile,
          CreateStudentProfile.skills[i],
        );
      }
    }

    if (CreateStudentProfile.jobs !== null) {
      for (let i = 0; i < CreateStudentProfile?.jobs?.length; i++) {
        await this.jobsservice.addJob(studentProfile, CreateStudentProfile.jobs[i]);
      }
    }

    if (CreateStudentProfile.website !== null) {
      studentProfile.website = CreateStudentProfile.website;
    }

    await this.studentProfileRepository.save(studentProfile);

    return studentProfile;
  }
}
