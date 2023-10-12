import { Test, TestingModule } from "@nestjs/testing";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";
import { AuthGuard, PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { FileService } from "../filesystem/file.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { StudentUser } from "./entity/StudentUser.entity";
import { Repository } from "typeorm";
import { StudentProfile } from "./entity/StudentProfile.entity";
import { SkillsService } from "./skills/skills.service";
import { JobsService } from "./jobs/jobs.service";
import { StudiesService } from "./studies/studies.service";
import { Skills } from "./skills/entity/skills.entity";
import { Jobs } from "./jobs/entity/jobs.entity";
import { Studies } from "./studies/entity/studies.entity";
import { Request } from "express";
import { StudentProfileResponseDto } from "./dto/student-profile-response.dto";

describe('StudentService', () => {
    let service: StudentService;
    let controller: StudentController
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          PassportModule.register({ defaultStrategy: 'jwt' }),
          JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '60m' },
          }),
        ],
        controllers: [StudentController],
        providers: [StudentService, FileService, SkillsService, JobsService, StudiesService,
          {
            provide: getRepositoryToken(StudentUser),
            useClass: Repository,
          },
          {
            provide: getRepositoryToken(Skills),
            useClass: Repository,
          },
          {
            provide: getRepositoryToken(Studies),
            useClass: Repository,
          },
          {
            provide: getRepositoryToken(Jobs),
            useClass: Repository,
          }, {
            provide: getRepositoryToken(StudentProfile),
            useClass: Repository
          }],
      })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();
  
      controller = module.get<StudentController>(StudentController);
      service = module.get<StudentService>(StudentService);
    })

    describe('getStudentProfile', () => {
        it('should return a studentProfile', async () => {
          const req = {
            user: {
                email: "test@example.com",
            }
          }
    
          const expectedProfile = {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            description: "I'm John Doe",
            email: "test@example.com",
            phone: "0612345678",
            location: "Marseille",
            picture: "",
            studies: [],
            skills: [],
            jobs: [],
            website: "http://example.com",
            note: 0
          };
    
          jest.spyOn(service, 'findStudentProfile').mockResolvedValueOnce(expectedProfile);
    
          const response = await controller.getStudentProfile(req);
    
          expect(service.findStudentProfile).toHaveBeenCalledWith(req.user.email);
          expect(response).toEqual(expectedProfile);
        });
      });

      describe('updateStudentProfile', () => {
        it('should return a studentProfile', async () => {
          const req = {
            user: {
                email: "test@example.com",
            }
          }

          const newProfile = {
            location: "Paris",
            phone: "0612345678",
            lastName: "Doe",
            firstName: "John",
            picture: null,
            email: "test@example.com",
            website: "http://example.com",
            description: "New Description"
          }
    
          const expectedProfile = {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            description: "New Description",
            email: "test@example.com",
            phone: "0612345678",
            location: "Paris",
            picture: "",
            studies: [],
            skills: [],
            jobs: [],
            website: "http://example.com",
            note: 0,
            studentId: 0,
            student: null,
          };
    
          jest.spyOn(service, 'updateStudentProfile').mockResolvedValueOnce(expectedProfile);
    
          const response = await controller.updateStudentProfile(null, req, newProfile);
    
          //expect(service.updateStudentProfile).toHaveBeenCalledWith(null, newProfile, req);
          expect(response).toEqual(expectedProfile);
        });
      });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});