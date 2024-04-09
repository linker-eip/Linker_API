import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';
import { StudentUser } from './entity/StudentUser.entity';
import { StudentProfile } from './entity/StudentProfile.entity';
import { CreateStudentProfileDto, UpdateSkillsDto } from './dto/create-student-profile.dto';
import { SkillsService } from './skills/skills.service';
import { StudentProfileResponseDto } from './dto/student-profile-response.dto';
import { JobsService } from './jobs/jobs.service';
import { StudiesService } from './studies/studies.service';
import { FileService } from '../filesystem/file.service';
import { DocumentTransferService } from '../document-transfer/src/services/document-transfer.service';
import { UpdateSkillDto } from './skills/dto/update-skill.dto';
import { UpdateJobsDto } from './jobs/dto/update-jobs.dto';
import { UpdateStudiesDto } from './studies/dto/update-studies.dto';
import { StudentSearchOptionDto } from './dto/student-search-option.dto';
import {
  StudentSearchResponseDto,
  formatToStudentSearchResponseDto,
} from './dto/student-search-response.dto';
import { CompanyService } from '../company/company.service';
import { SkillList } from './skills/consts/skills-list';
import { StudentPreferences } from './entity/StudentPreferences.entity';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UploadStudentDocumentDto } from './dto/upload-student-document.dto';
import { StudentDocument } from './entity/StudentDocuments.entity';
import { DocumentStatus } from './enum/StudentDocument.enum';
import { DocumentStatusResponseDto } from './dto/document-status-response.dto';

@Injectable()
export class StudentService {

  constructor(
    @InjectRepository(StudentUser)
    private studentRepository: Repository<StudentUser>,
    @InjectRepository(StudentProfile)
    private studentProfileRepository: Repository<StudentProfile>,
    @InjectRepository(StudentPreferences)
    private studentPreferencesRepository: Repository<StudentPreferences>,
    @InjectRepository(StudentDocument)
    private studentDocumentRepository: Repository<StudentDocument>,
    private readonly skillsService: SkillsService,
    private readonly jobsservice: JobsService,
    private readonly studiesService: StudiesService,
    private readonly fileService: FileService,
    private readonly documentTransferService: DocumentTransferService,
    private readonly companyService: CompanyService,
  ) { }

  async findAll(): Promise<StudentUser[]> {
    return this.studentRepository.find();
  }

  async findOneByEmail(email: string): Promise<StudentUser | undefined> {
    return this.studentRepository.findOne({ where: { email: email } });
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

  async findAllByIdIn(ids: number[]): Promise<StudentUser[]> {
    return this.studentRepository.findBy({ id: In(ids) });
  }

  async findAllStudentsProfilesByStudentIds(studentIds: number[]) {
    return await Promise.all(
      studentIds.map(async (studentId) => {
        try {
          const studentProfile = await this.studentProfileRepository.findOneBy({
            studentId: studentId,
          });
          return studentProfile;
        } catch (e) {
          throw new Error();
        }
      }),
    );
  }

  async save(student: StudentUser): Promise<StudentUser> {
    return this.studentRepository.save(student);
  }

  mapSkillToDto(json: any): UpdateSkillsDto {
    let dto: UpdateSkillsDto = new UpdateSkillsDto();
    json = JSON.parse(json);
    dto.Data = json.skills['Data'];
    dto['Design & Produit'] = json.skills['Design & Produit'];
    dto.Development = json.skills['Development'];
    dto['Marketing & Sales'] = json.skills['Marketing & Sales'];
    dto['No-code'] = json.skills['No-Code'];
    return dto;
  }

  async findStudentProfile(email: string) {
    const profile = await this.studentProfileRepository.findOne({
      where: { email },
    });
    if (!profile) throw new Error(`Could not find student profile`);
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
      skills: this.mapSkillToDto(profile.skills),
      jobs: jobs,
      website: profile.website,
      note: profile.note,
      noteNumber: profile.nbNotes
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
      const [width, height] = [500, 500];
      const url = await this.documentTransferService.uploadFile(picture);

      studentProfile.picture = url;
      user.picture = url;
    }

    if (CreateStudentProfile.studies !== null) {
      for (let i = 0; i < CreateStudentProfile?.studies?.length; i++) {
        await this.studiesService.addStudie(
          studentProfile,
          CreateStudentProfile.studies[i],
        );
      }
    }

    if (CreateStudentProfile.skills !== undefined && CreateStudentProfile.skills !== null) {
      var skillResult = {
        "skills": {
          "Development": [],
          "No-Code": [],
          "Design & Produit": [],
          "Data": [],
          "Marketing & Sales": [],
        }
      }
      if (CreateStudentProfile.skills.Data) {
        for (let i = 0; i < CreateStudentProfile.skills.Data.length; i++) {
          var skill = CreateStudentProfile.skills.Data[i]
          if (!SkillList.skills.Data.includes(skill)) {
            throw new HttpException(
              'Invalid skill : ' + skill,
              HttpStatus.BAD_REQUEST,
            );
          }
          skillResult.skills.Data.push(skill);
        }
      }
      if (CreateStudentProfile.skills.Development) {

        for (let i = 0; i < CreateStudentProfile.skills.Development.length; i++) {
          var skill = CreateStudentProfile.skills.Development[i]
          if (!SkillList.skills.Development.includes(skill)) {
            throw new HttpException(
              'Invalid skill : ' + skill,
              HttpStatus.BAD_REQUEST,
            );
          }
          skillResult.skills.Development.push(skill);
        }
      }
      if (CreateStudentProfile.skills['No-code']) {

        for (let i = 0; i < CreateStudentProfile.skills['No-code'].length; i++) {
          var skill = CreateStudentProfile.skills['No-code'][i]
          if (!SkillList.skills['No-code'].includes(skill)) {
            throw new HttpException(
              'Invalid skill : ' + skill,
              HttpStatus.BAD_REQUEST,
            );
          }
          skillResult.skills['No-Code'].push(skill);
        }
      }
      if (CreateStudentProfile.skills['Design & Produit']) {

        for (let i = 0; i < CreateStudentProfile.skills['Design & Produit'].length; i++) {
          var skill = CreateStudentProfile.skills['Design & Produit'][i]
          if (!SkillList.skills['Design & Produit'].includes(skill)) {
            throw new HttpException(
              'Invalid skill : ' + skill,
              HttpStatus.BAD_REQUEST,
            );
          }
          skillResult.skills['Design & Produit'].push(skill);
        }
      }
      if (CreateStudentProfile.skills['Marketing & Sales']) {

        for (let i = 0; i < CreateStudentProfile.skills['Marketing & Sales'].length; i++) {
          var skill = CreateStudentProfile.skills['Marketing & Sales'][i]
          if (!SkillList.skills['Marketing & Sales'].includes(skill)) {
            throw new HttpException(
              'Invalid skill : ' + skill,
              HttpStatus.BAD_REQUEST,
            );
          }
          skillResult.skills['Marketing & Sales'].push(skill);
        }
      }
      studentProfile.skills = JSON.stringify(skillResult)
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

    return await Promise.all(
      students.map(async (student) => {
        try {
          let studentProfile = await this.studentProfileRepository.findOneBy({
            studentId: student.id,
          });
          return formatToStudentSearchResponseDto(
            student,
            studentProfile.picture,
          );
        } catch (e) {
          throw new Error();
        }
      }),
    );
  }

  async getCompanyInfoByStudent(companyId: number) {
    const companyProfile = await this.companyService.findCompanyProfileById(
      companyId,
    );
    if (!companyProfile)
      throw new HttpException('Invalid company', HttpStatus.NOT_FOUND);
    return companyProfile;
  }

  async saveStudentProfile(studentProfile: StudentProfile) {
    return this.studentProfileRepository.save(studentProfile);
  }

  async deleteStudent(student: any) {
    const studentProfile = await this.studentProfileRepository.findOne({
      where: { studentId: student.id },
    });
    if (studentProfile) {
      await this.studentProfileRepository.remove(studentProfile);
    }

    return this.studentRepository.remove(student);
  }

  async createPref() {
    const students = await this.studentRepository.find();

    for (const student of students) {
      const prefs = new StudentPreferences()
      prefs.studentId = student.id;
      this.studentPreferencesRepository.save(prefs)
    }
  }

  async updatePreferences(req: any, updatePreferencesDto: UpdatePreferencesDto) {
    const student = await this.studentRepository.findOne({ where: { email: req.user.email } })

    const existingPreferences = await this.studentPreferencesRepository.findOneBy({ studentId: student.id })

    if (!existingPreferences) {
      throw new HttpException(
        'Preferences not found',
        HttpStatus.CONFLICT,
      );
    }

    Object.assign(existingPreferences, updatePreferencesDto);

    await this.studentPreferencesRepository.save(existingPreferences);

    return existingPreferences;
  }

  async uploadStudentDocument(file: any, UploadStudentDocument: UploadStudentDocumentDto, user: any) {
    let student;
    student = await this.findOneByEmail(user.email)
    if (!student) {
      throw new HttpException("Invalid student", HttpStatus.UNAUTHORIZED)
    }

    let studentDocument = await this.studentDocumentRepository.findOne({ where: { studentId: student.id, documentType: UploadStudentDocument.documentType } })

    if (studentDocument != null) {
      if (studentDocument.status == DocumentStatus.VERIFIED) {
        throw new HttpException("Ce fichier a déjà été validé", HttpStatus.CONFLICT)
      }
    } else {
      studentDocument = new StudentDocument()
    }

    const url = await this.documentTransferService.uploadFileNotImage(file);

    studentDocument.file = url
    studentDocument.studentId = student.id;
    studentDocument.comment = "";
    studentDocument.documentType = UploadStudentDocument.documentType;
    studentDocument.status = DocumentStatus.PENDING;

    this.studentDocumentRepository.save(studentDocument);
  }

  async getDocumentStatus(user: any): Promise<DocumentStatusResponseDto[]> {
    const student = await this.findOneByEmail(user.email);
    if (!student) {
      throw new HttpException("Invalid student", HttpStatus.UNAUTHORIZED)
    }

    const documentStatuses = await this.studentDocumentRepository.findBy({ studentId: student.id })

    const documentStatusesResponse = documentStatuses.map(doc => {
      const it = new DocumentStatusResponseDto()
      it.documentType = doc.documentType
      it.status = doc.status
      it.comment = doc.comment
      return it
    })

    return documentStatusesResponse
  }
}
