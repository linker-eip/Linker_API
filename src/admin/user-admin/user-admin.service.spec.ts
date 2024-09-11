import { Test, TestingModule } from '@nestjs/testing';
import { UserAdminController } from './user-admin.controller';
import { UserAdminService } from './user-admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { StudentProfile } from '../../student/entity/StudentProfile.entity';
import { CompanyUser } from '../../company/entity/CompanyUser.entity';
import { CompanyProfile } from '../../company/entity/CompanyProfile.entity';
import { RegisterStudentAdminDto } from './dto/register-student-admin.dto';
import { Repository } from 'typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { StudentAdminResponseDto } from './dto/students-admin-response.dto';
import { StudentSearchOptionAdminDto } from './dto/student-search-option-admin.dto';
import { UpdateStudentAdminDto } from './dto/update-student-admin.dto';
import { CompanyAdminResponseDto } from './dto/company-admin-response.dto';
import { RegisterCompanyAdminDto } from './dto/register-company-admin.dto';
import { UpdateCompanyAdminDto } from './dto/update-company-admin.dto';

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
          groupId: null,
          profile: null,
          isBlocked: false,
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
          groupId: 1,
          profile: null,
          isBlocked: false,
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

  describe('updateStudent', () => {
    it('should update a student', async () => {
      const id = 1;

      const updateStudentAdminDto: UpdateStudentAdminDto = {
        email: 'tonybano83@gmail.com',
        firstName: 'Tony',
        lastName: 'Bano',
        isActive: true,
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
        .spyOn(service, 'updateStudent')
        .mockResolvedValueOnce(expectedStudent);

      const student: StudentUser = {
        id: 1,
        email: 'tonybano83@gmail.com',
        password: 'Azerty1234!',
        firstName: 'Tony',
        lastName: 'Bano',
        picture: null,
        isActive: true,
        lastConnectedAt: new Date('2023-10-13T03:43:23.946Z'),
        createdAt: new Date('2023-10-13T03:43:23.946Z'),
        isVerified: true,
        verificationKey: '',
        resetPasswordToken: null,
        missionsIds: [],
        groupId: null,
        profile: null,
        isBlocked: false,
      };

      jest.spyOn(service, 'findOneStudentById').mockResolvedValueOnce(student);

      const response = await controller.updateStudent(
        updateStudentAdminDto,
        id,
      );
      expect(service.updateStudent).toHaveBeenCalledWith(
        student,
        updateStudentAdminDto,
      );
    });
  });

  describe('deleteStudent', () => {
    it('should delete a student', async () => {
      const id = 1;

      const expectedResponse = {
        raw: [],
        affected: 1,
      };

      jest
        .spyOn(service, 'deleteStudent')
        .mockResolvedValueOnce(expectedResponse);

      const student: StudentUser = {
        id: 1,
        email: 'tonybano83@gmail.com',
        password: 'Azerty1234!',
        firstName: 'Tony',
        lastName: 'Bano',
        picture: null,
        isActive: true,
        lastConnectedAt: new Date('2023-10-13T03:43:23.946Z'),
        createdAt: new Date('2023-10-13T03:43:23.946Z'),
        isVerified: true,
        verificationKey: '',
        resetPasswordToken: null,
        missionsIds: [],
        groupId: null,
        profile: null,
        isBlocked: false,
      };

      jest.spyOn(service, 'findOneStudentById').mockResolvedValueOnce(student);

      const response = await controller.deleteStudent(id);
      expect(service.deleteStudent).toHaveBeenCalledWith(student);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('findAllCompanies', () => {
    it('should return an array of companies', async () => {
      const searchOption: StudentSearchOptionAdminDto = {
        searchString: '',
        isActive: true,
      };

      const req = {
        user: {
          email: 'test@exemple.com',
        },
      };

      const expectedCompanies: CompanyUser[] = [
        {
          id: 1,
          email: 'test@exemple.com',
          companyName: 'Company',
          picture: null,
          isActive: true,
          lastConnectedAt: new Date('2023-10-13T03:43:23.946Z'),
          password: 'Azerty1234!',
          resetPasswordToken: null,
          phoneNumber: '0612345678',
          companyPicture: null,
          createdAt: new Date('2023-10-13T03:43:23.946Z'),
          profile: null,
          isBlocked: false,
        },
      ];

      const expectedResponse: CompanyAdminResponseDto[] = [
        {
          id: 1,
          email: 'test@exemple.com',
          companyName: 'Company',
          picture: null,
          isActive: true,
          lastConnectedAt: new Date('2023-10-13T03:43:23.946Z'),
          phoneNumber: '0612345678',
          companyPicture: null,
          createdAt: new Date('2023-10-13T03:43:23.946Z'),
        },
      ];

      jest
        .spyOn(service, 'findAllCompanies')
        .mockResolvedValueOnce(expectedCompanies);

      const response = await controller.findAllCompanies(searchOption, req);

      expect(service.findAllCompanies).toHaveBeenCalledWith(searchOption);
      expect(expectedResponse).toEqual(response);
    });
  });

  describe('createCompany', () => {
    it('should create a company', async () => {
      const registerCompanyAdminDto: RegisterCompanyAdminDto = {
        email: 'test@gmail.com',
        password: 'Azerty1234!',
        companyName: 'Company',
        phoneNumber: '0612345678',
      };

      const expectedCompany = new CompanyUser();
      expectedCompany.id = 1;
      expectedCompany.email = 'test@gmail.com';
      expectedCompany.companyName = 'Company';
      expectedCompany.picture = null;
      expectedCompany.isActive = true;
      expectedCompany.lastConnectedAt = new Date('2023-10-13T03:43:23.946Z');
      expectedCompany.phoneNumber = '0612345678';
      expectedCompany.companyPicture = null;
      expectedCompany.createdAt = new Date('2023-10-13T03:43:23.946Z');

      const expectedResponse: CompanyAdminResponseDto = {
        id: 1,
        email: 'test@gmail.com',
        companyName: 'Company',
        picture: null,
        isActive: true,
        lastConnectedAt: new Date('2023-10-13T03:43:23.946Z'),
        phoneNumber: '0612345678',
        companyPicture: null,
        createdAt: new Date('2023-10-13T03:43:23.946Z'),
      };

      jest
        .spyOn(service, 'createCompany')
        .mockResolvedValueOnce(expectedCompany);

      const response = await controller.createCompany(registerCompanyAdminDto);
      expect(service.createCompany).toHaveBeenCalledWith(
        registerCompanyAdminDto,
      );

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('getCompany', () => {
    it('should get a company', async () => {
      const id = 1;

      const expectedCompany: CompanyUser = {
        id: 1,
        email: 'test@gmail.com',
        companyName: 'Company',
        picture: null,
        isActive: true,
        lastConnectedAt: new Date('2023-10-13T03:43:23.946Z'),
        phoneNumber: '0612345678',
        companyPicture: null,
        createdAt: new Date('2023-10-13T03:43:23.946Z'),
        profile: null,
        password: 'Azerty1234!',
        resetPasswordToken: null,
        isBlocked: false,
      };

      const expectedResponse: CompanyAdminResponseDto = {
        id: 1,
        email: 'test@gmail.com',
        companyName: 'Company',
        picture: null,
        isActive: true,
        lastConnectedAt: new Date('2023-10-13T03:43:23.946Z'),
        phoneNumber: '0612345678',
        companyPicture: null,
        createdAt: new Date('2023-10-13T03:43:23.946Z'),
      };

      jest
        .spyOn(service, 'findOneCompanyById')
        .mockResolvedValueOnce(expectedCompany);

      const response = await controller.getCompany(id);

      expect(service.findOneCompanyById).toHaveBeenCalledWith(id);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('updateCompany', () => {
    it('should update a company', async () => {
      const id = 1;

      const updateCompanyAdminDto: UpdateCompanyAdminDto = {
        email: 'test@gmail.com',
        companyName: 'Company',
        phoneNumber: '0612345678',
      };

      const expectedCompany: CompanyUser = {
        id: 1,
        email: 'test@gmail.com',
        companyName: 'Company',
        picture: null,
        isActive: true,
        lastConnectedAt: new Date('2023-10-13T03:43:23.946Z'),
        phoneNumber: '0612345678',
        companyPicture: null,
        createdAt: new Date('2023-10-13T03:43:23.946Z'),
        profile: null,
        password: 'Azerty1234!',
        resetPasswordToken: null,
        isBlocked: false,
      };

      const expectedResponse: CompanyAdminResponseDto = {
        id: 1,
        email: 'test@gmail.com',
        companyName: 'Company',
        picture: null,
        isActive: true,
        lastConnectedAt: new Date('2023-10-13T03:43:23.946Z'),
        phoneNumber: '0612345678',
        companyPicture: null,
        createdAt: new Date('2023-10-13T03:43:23.946Z'),
      };

      jest
        .spyOn(service, 'updateCompany')
        .mockResolvedValueOnce(expectedCompany);

      const company: CompanyUser = {
        id: 1,
        email: 'tonybano83@gmail.com',
        password: 'Azerty1234!',
        picture: null,
        isActive: true,
        lastConnectedAt: new Date('2023-10-13T03:43:23.946Z'),
        createdAt: new Date('2023-10-13T03:43:23.946Z'),
        resetPasswordToken: null,
        companyName: 'Company',
        phoneNumber: '0612345678',
        companyPicture: null,
        profile: null,
        isBlocked: false,
      };

      jest.spyOn(service, 'findOneCompanyById').mockResolvedValueOnce(company);

      const response = await controller.updateCompany(
        updateCompanyAdminDto,
        id,
      );

      expect(service.updateCompany).toHaveBeenCalledWith(
        company,
        updateCompanyAdminDto,
      );

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('deleteCompany', () => {
    it('should delete a company', async () => {
      const id = 1;

      const expectedResponse = {
        raw: [],
        affected: 1,
      };

      jest
        .spyOn(service, 'deleteCompany')
        .mockResolvedValueOnce(expectedResponse);

      const company: CompanyUser = {
        id: 1,
        email: 'tonybano83@gmail.com',
        password: 'Azerty1234!',
        picture: null,
        isActive: true,
        lastConnectedAt: new Date('2023-10-13T03:43:23.946Z'),
        createdAt: new Date('2023-10-13T03:43:23.946Z'),
        resetPasswordToken: null,
        companyName: 'Company',
        phoneNumber: '0612345678',
        companyPicture: null,
        profile: null,
        isBlocked: false,
      };

      jest.spyOn(service, 'findOneCompanyById').mockResolvedValueOnce(company);

      const response = await controller.deleteCompany(id);
      expect(service.deleteCompany).toHaveBeenCalledWith(company);

      expect(response).toEqual(expectedResponse);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
