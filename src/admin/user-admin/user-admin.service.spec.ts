import { Test, TestingModule } from '@nestjs/testing';
import { UserAdminController } from './user-admin.controller';
import { UserAdminService } from './user-admin.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { StudentProfile } from '../../student/entity/StudentProfile.entity';
import { CompanyUser } from '../../company/entity/CompanyUser.entity';
import { CompanyProfile } from '../../company/entity/CompanyProfile.entity';
import { RegisterStudentAdminDto } from './dto/register-student-admin.dto';
import { Repository } from 'typeorm';
import { StudentService } from '../../student/student.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { StudentAdminResponseDto } from './dto/students-admin-response.dto';
import { StudentSearchOptionAdminDto } from './dto/student-search-option-admin.dto';
import { UpdateStudentAdminDto } from './dto/update-student-admin.dto';

describe('UserAdminService', () => {
  let service: UserAdminService;
  let controller: UserAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      providers: [
        UserAdminService,
        {
          provide: getRepositoryToken(StudentUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentProfile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CompanyProfile),
          useClass: Repository,
        },
      ],
      controllers: [UserAdminController],
      exports: [UserAdminService],
    }).compile();

    controller = module.get<UserAdminController>(UserAdminController);
    service = module.get<UserAdminService>(UserAdminService);
  });

  describe('findAllStudents', () => {
    it('should return an array of students', async () => {
      const searchOption: StudentSearchOptionAdminDto = {
        searchString: '',
        isActive: true,
      };

      const req = {
        user: {
          email: 'test@example.com',
        },
      };

      const expectedStudents: StudentUser[] = [
        {
          id: 1,
          email: 'tonybano83@gmail.com',
          firstName: 'Tony',
          lastName: 'Bano',
          picture: null,
          isActive: true,
          lastConnectedAt: new Date('2023-10-13T03:43:23.946Z'),
          createdAt: new Date('2023-10-13T03:43:23.946Z'),
          password: 'Azerty1234!',
          resetPasswordToken: null,
          isVerified: true,
          verificationKey: '',
          missionsIds: [],
        },
        {
          id: 2,
          email: 'tonybano833@gmail.com',
          firstName: 'Tony',
          lastName: 'Bano',
          picture: null,
          isActive: true,
          lastConnectedAt: new Date('2023-10-13T03:43:23.946Z'),
          createdAt: new Date('2023-10-13T03:43:23.946Z'),
          password: 'Azerty1234!',
          resetPasswordToken: null,
          isVerified: true,
          verificationKey: '',
          missionsIds: [],
        },
      ];

      const expectedResponse: StudentAdminResponseDto[] = [
        {
          id: 1,
          email: 'tonybano83@gmail.com',
          FirstName: 'Tony',
          LastName: 'Bano',
          picture: null,
          isActive: true,
          lastConnectedAt: new Date('2023-10-13T03:43:23.946Z'),
          createdAt: new Date('2023-10-13T03:43:23.946Z'),
        },
        {
          id: 2,
          email: 'tonybano833@gmail.com',
          FirstName: 'Tony',
          LastName: 'Bano',
          picture: null,
          isActive: true,
          lastConnectedAt: new Date('2023-10-13T03:43:23.946Z'),
          createdAt: new Date('2023-10-13T03:43:23.946Z'),
        },
      ];

      jest
        .spyOn(service, 'findAllStudents')
        .mockResolvedValueOnce(expectedStudents);

      const response = await controller.findAllStudents(searchOption, req);

      expect(service.findAllStudents).toHaveBeenCalledWith(searchOption);
      expect(expectedResponse).toEqual(response);
    });
  });

  describe('createStudent', () => {
    it('should create a student', async () => {
      const RegisterStudentAdminDto: RegisterStudentAdminDto = {
        email: 'tonybano83@gmail.com',
        password: 'Azerty1234!',
        firstName: 'Tony',
        lastName: 'Bano',
      };
      const expectedStudent = new StudentUser();
      expectedStudent.id = 1;
      expectedStudent.email = 'tonybano83@gmail.com';
      expectedStudent.firstName = 'Tony';
      expectedStudent.lastName = 'Bano';
      expectedStudent.picture = null;
      expectedStudent.isActive = true;
      expectedStudent.lastConnectedAt = new Date('2023-10-13T03:43:23.946Z');
      expectedStudent.createdAt = new Date('2023-10-13T03:43:23.946Z');

      const expectedResponse = new StudentAdminResponseDto();
      expectedResponse.id = 1;
      expectedResponse.email = 'tonybano83@gmail.com';
      expectedResponse.FirstName = 'Tony';
      expectedResponse.LastName = 'Bano';
      expectedResponse.picture = null;
      expectedResponse.isActive = true;
      expectedResponse.lastConnectedAt = new Date('2023-10-13T03:43:23.946Z');
      expectedResponse.createdAt = new Date('2023-10-13T03:43:23.946Z');

      jest
        .spyOn(service, 'createStudent')
        .mockResolvedValueOnce(expectedStudent);

      const response = await controller.createStudent(RegisterStudentAdminDto);
      expect(service.createStudent).toHaveBeenCalledWith(
        RegisterStudentAdminDto,
      );

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('getStudent', () => {
    it('should get a student', async () => {
      const id = 1;

      const expectedStudent = new StudentUser();
      expectedStudent.id = 1;
      expectedStudent.email = 'tonybano83@gmail.com';
      expectedStudent.firstName = 'Tony';
      expectedStudent.lastName = 'Bano';
      expectedStudent.picture = null;
      expectedStudent.isActive = true;
      expectedStudent.lastConnectedAt = new Date('2023-10-13T03:43:23.946Z');
      expectedStudent.createdAt = new Date('2023-10-13T03:43:23.946Z');

      const expectedResponse = new StudentAdminResponseDto();
      expectedResponse.id = 1;
      expectedResponse.email = 'tonybano83@gmail.com';
      expectedResponse.FirstName = 'Tony';
      expectedResponse.LastName = 'Bano';
      expectedResponse.picture = null;
      expectedResponse.isActive = true;
      expectedResponse.lastConnectedAt = new Date('2023-10-13T03:43:23.946Z');
      expectedResponse.createdAt = new Date('2023-10-13T03:43:23.946Z');

      jest
        .spyOn(service, 'findOneStudentById')
        .mockResolvedValueOnce(expectedStudent);

      const response = await controller.getStudent(id);
      expect(service.findOneStudentById).toHaveBeenCalledWith(id);

      expect(response).toEqual(expectedResponse);
    });
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
