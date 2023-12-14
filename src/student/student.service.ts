import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';
import { StudentUser } from './entity/StudentUser.entity';
import { StudentProfile } from './entity/StudentProfile.entity';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { SkillsService } from './skills/skills.service';
import { StudentProfileResponseDto } from './dto/student-profile-response.dto';
import { JobsService } from './jobs/jobs.service';
import { StudiesService } from './studies/studies.service';
import { FileService } from '../filesystem/file.service';
import { UpdateSkillDto } from './skills/dto/update-skill.dto';
import { UpdateJobsDto } from './jobs/dto/update-jobs.dto';
import { UpdateStudiesDto } from './studies/dto/update-studies.dto';
import { StudentSearchOptionDto } from './dto/student-search-option.dto';
import { StudentSearchResponseDto, formatToStudentSearchResponseDto } from './dto/student-search-response.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentUser)
    private studentRepository: Repository<StudentUser>,
    @InjectRepository(StudentProfile)
    private studentProfileRepository: Repository<StudentProfile>,
    private readonly skillsService: SkillsService,
    private readonly jobsservice: JobsService,
    private readonly studiesService: StudiesService,
    private readonly fileService: FileService,
  ) {}

  async findAll(): Promise<StudentUser[]> {
    return this.studentRepository.find();
  }

  async findOneByEmail(email: string): Promise<StudentUser | undefined> {
    return this.studentRepository.findOne({ where: { email } });
  }

  async findOneById(studentId: number): Promise<StudentUser | undefined> {
    return this.studentRepository.findOne({ where: { id: studentId } });
  }

  async findOneByResetPasswordToken(
    token: string,
  ): Promise<StudentUser | undefined> {
    return this.studentRepository.findOne({
      where: { resetPasswordToken: token },
    });
  }

  async findOneByVerificationKey(
    key: string,
  ): Promise<StudentUser | undefined> {
    return this.studentRepository.findOne({
      where: { verificationKey: key },
    });
  }

  async findAllByIdIn(ids: number[]) : Promise<StudentUser[]> {
    return this.studentRepository.findBy({id: In(ids)});
  }

  async save(student: StudentUser): Promise<StudentUser> {
    return this.studentRepository.save(student);
  }

  async findStudentProfile(email: string) {
    const profile = await this.studentProfileRepository.findOne({
      where: { email },
    });
    if (!profile) throw new Error(`Could not find student profile`);
    const skills = await this.skillsService.findSkills(profile.id);
    const jobs = await this.jobsservice.findJobs(profile.id);
    const studies = await this.studiesService.findStudies(profile.id);
    return {
      lastName: profile.lastName,
      firstName: profile.firstName,
      description: profile.description,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      picture: profile.picture,
      studies: studies,
      skills: skills,
      jobs: jobs,
      website: profile.website,
      note: profile.note,
    };
  }

  async updateStudentProfile(
    picture,
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

    if (CreateStudentProfile.firstName !== null) {
      studentProfile.firstName = CreateStudentProfile.firstName;
    }

    if (CreateStudentProfile.lastName !== null) {
      studentProfile.lastName = CreateStudentProfile.lastName;
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

    if (picture) {
      studentProfile.picture = await this.fileService.storeFile(picture);
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
        await this.jobsservice.addJob(
          studentProfile,
          CreateStudentProfile.jobs[i],
        );
      }
    }

    if (CreateStudentProfile.website !== null) {
      studentProfile.website = CreateStudentProfile.website;
    }

    await this.studentProfileRepository.save(studentProfile);

    return this.findStudentProfile(req.email);
  }

  async findStudentProfileByStudentId(Studentid: number) {
    const profile = await this.studentProfileRepository.findOne({
      where: { studentId: Studentid },
    });
    if (!profile) throw new Error(`Could not find student profile`);
    return profile;
  }

  async updateSkill(skillId: number, body: UpdateSkillDto, req: any) {
    const studentProfile = await this.studentProfileRepository.findOne({
      where: { email: req.email },
    });
    if (!studentProfile) {
      throw new HttpException(
        'Invalid student profile',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const skill = await this.skillsService.findSkillById(skillId);
    if (!skill) {
      throw new HttpException('Invalid skill', HttpStatus.NOT_FOUND);
    }

    await this.skillsService.updateSkill(skillId, body);

    return this.findStudentProfile(req.email);
  }

  async updateJob(jobId: number, body: UpdateJobsDto, req: any) {
    const studentProfile = await this.studentProfileRepository.findOne({
      where: { email: req.email },
    });
    if (!studentProfile) {
      throw new HttpException(
        'Invalid student profile',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const job = await this.jobsservice.findJobById(jobId);
    if (!job) {
      throw new HttpException('Invalid job', HttpStatus.NOT_FOUND);
    }

    await this.jobsservice.updateJob(jobId, body);

    return this.findStudentProfile(req.email);
  }

  async updateStudies(studiesId: number, body: UpdateStudiesDto, req: any) {
    const studentProfile = await this.studentProfileRepository.findOne({
      where: { email: req.email },
    });
    if (!studentProfile) {
      throw new HttpException(
        'Invalid student profile',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const studies = await this.studiesService.findStudieById(studiesId);
    if (!studies) {
      throw new HttpException('Invalid studies', HttpStatus.NOT_FOUND);
    }

    await this.studiesService.updateStudie(studiesId, body);

    return this.findStudentProfile(req.email);
  }

  async deleteSkill(skillId: number, req: any) {
    const studentProfile = await this.studentProfileRepository.findOne({
      where: { email: req.email },
    });
    if (!studentProfile) {
      throw new HttpException(
        'Invalid student profile',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const skill = await this.skillsService.findSkillById(skillId);
    if (!skill) {
      throw new HttpException('Invalid skill', HttpStatus.NOT_FOUND);
    }

    await this.skillsService.deleteSkill(skillId);

    return this.findStudentProfile(req.email);
  }

  async deleteJob(jobId: number, req: any) {
    const studentProfile = await this.studentProfileRepository.findOne({
      where: { email: req.email },
    });
    if (!studentProfile) {
      throw new HttpException(
        'Invalid student profile',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const job = await this.jobsservice.findJobById(jobId);
    if (!job) {
      throw new HttpException('Invalid job', HttpStatus.NOT_FOUND);
    }

    await this.jobsservice.deleteJob(jobId);

    return this.findStudentProfile(req.email);
  }

  async deleteStudies(studiesId: number, req: any) {
    const studentProfile = await this.studentProfileRepository.findOne({
      where: { email: req.email },
    });
    if (!studentProfile) {
      throw new HttpException(
        'Invalid student profile',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const studies = await this.studiesService.findStudieById(studiesId);
    if (!studies) {
      throw new HttpException('Invalid studies', HttpStatus.NOT_FOUND);
    }

    await this.studiesService.deleteStudie(studiesId);

    return this.findStudentProfile(req.email);
  }

  async findAllStudents(
    searchOption: StudentSearchOptionDto,
  ): Promise<StudentSearchResponseDto[]> {
    const { searchString } = searchOption;

    let studentsQuery: SelectQueryBuilder<StudentUser> =
      this.studentRepository.createQueryBuilder('studentUser');

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
          qb.andWhere('studentUser.isActive = :isActive', {
            isActive: true,
          });

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

    return await Promise.all(students.map(async student => {
      try {
      let studentProfile = await this.studentProfileRepository.findOneBy({studentId: student.id})
      return formatToStudentSearchResponseDto(student, studentProfile.picture);
      } catch(e) {
        throw new Error();
      }
    }))
  }
}
