import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserAdminService } from './user-admin.service';
import { StudentAdminResponseDto } from './dto/students-admin-response.dto';
import { formatToStudentAdminResponseDto } from './dto/students-admin-response.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentSearchOptionAdminDto } from './dto/student-search-option-admin.dto';
import { RegisterStudentAdminDto } from './dto/register-student-admin.dto';
import { StudentUserByIdPipe } from './pipes/student.user.pipe';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { AdminGuard } from '../guards/admin/admin.guard';
import { UpdateStudentAdminDto } from './dto/update-student-admin.dto';
import { CompanyAdminResponseDto, formatToCompanyAdminResponseDto } from './dto/company-admin-response.dto';
import { CompanySearchOptionAdminDto } from './dto/company-search-option-admin.dto';
import { CompanyUser } from '../../company/entity/CompanyUser.entity';
import { CompanyUserByIdPipe } from './pipes/company.user.pipe';
import { UpdateCompanyAdminDto } from './dto/update-company-admin.dto';
import { RegisterCompanyAdminDto } from './dto/register-company-admin.dto';

@ApiBearerAuth()
@ApiTags('Admin')
@Controller('api/admin/users')
@UseGuards(AdminGuard)
export class UserAdminController {
  constructor(private readonly userAdminService: UserAdminService) {}


  //STUDENTS
  @Get('students')
  @ApiOperation({
    description: 'Get all students',
    summary: 'Get all students',
  })
  @ApiOkResponse({
    description: 'Get all students',
    type: StudentAdminResponseDto,
  })
  async findAllStudents(
    @Query() searchOption: StudentSearchOptionAdminDto,
    @Req() req,
  ): Promise<StudentAdminResponseDto[]> {
    const students = await this.userAdminService.findAllStudents(searchOption);
    return students.map(formatToStudentAdminResponseDto);
  }

  @Post('student')
  @ApiOperation({
    description: 'Create a student',
    summary: 'Create a student',
  })
  @ApiOkResponse({
    description: 'Create a student',
    type: StudentAdminResponseDto,
  })
  async createStudent(
    @Body() body: RegisterStudentAdminDto,
  ): Promise<StudentAdminResponseDto> {
    const student = await this.userAdminService.createStudent(body);
    return formatToStudentAdminResponseDto(student);
  }

  @Put('student/:studentId')
  @ApiOperation({
    description: 'Update a student',
    summary: 'Update a student',
  })
  @ApiOkResponse({
    description: 'Update a student',
    type: StudentAdminResponseDto,
  })
  async updateStudent(
    @Body() body: UpdateStudentAdminDto,
    @Param('studentId', StudentUserByIdPipe)
    student: StudentUser,
  ): Promise<StudentAdminResponseDto> {
    const updatedStudent = await this.userAdminService.updateStudent(
      student,
      body,
    );
    return formatToStudentAdminResponseDto(updatedStudent);
  }

  @Get('student/:studentId')
  @ApiOperation({
    description: 'Get a student',
    summary: 'Get a student',
  })
  @ApiOkResponse({
    description: 'Get a student',
    type: StudentAdminResponseDto,
  })
  async getStudent(
    @Param('studentId', StudentUserByIdPipe)
    student: StudentUser,
  ): Promise<StudentAdminResponseDto> {
    return formatToStudentAdminResponseDto(student);
  }

  @Delete('student/:studentId')
  @ApiOperation({
    description: 'Delete a student',
    summary: 'Delete a student',
  })
  @ApiOkResponse({
    description: 'Delete a student',
    type: StudentAdminResponseDto,
  })
  async deleteStudent(
    @Param('studentId', StudentUserByIdPipe)
    student: StudentUser,
  ) {
    return this.userAdminService.deleteStudent(student);
  }


  //COMPANIES

  @Get('companies')
  @ApiOperation({
    description: 'Get all companies',
    summary: 'Get all companies',
  })
  @ApiOkResponse({
    description: 'Get all companies',
    type: CompanyAdminResponseDto,
  })
  async findAllCompanies(
    @Query() searchOption: CompanySearchOptionAdminDto,
    @Req() req,
  ): Promise<CompanyAdminResponseDto[]> {
    const companies = await this.userAdminService.findAllCompanies(searchOption);
    return companies.map(formatToCompanyAdminResponseDto);
  }

  @Post('company')
  @ApiOperation({
    description: 'Create a company',
    summary: 'Create a company',
  })
  @ApiOkResponse({
    description: 'Create a company',
    type: CompanyAdminResponseDto,
  })
  async createCompany(
    @Body() body: RegisterCompanyAdminDto,
  ): Promise<CompanyAdminResponseDto> {
    const company = await this.userAdminService.createCompany(body);
    return formatToCompanyAdminResponseDto(company);
  }

  @Get('company/:companyId')
  @ApiOperation({
    description: 'Get a company',
    summary: 'Get a company',
  })
  @ApiOkResponse({
    description: 'Get a company',
    type: CompanyAdminResponseDto,
  })
  async getCompany(
    @Param('companyId', CompanyUserByIdPipe)
    company: CompanyUser,
  ): Promise<CompanyAdminResponseDto> {
    return formatToCompanyAdminResponseDto(company);
  }

  @Delete('company/:companyId')
  @ApiOperation({
    description: 'Delete a company',
    summary: 'Delete a company',
  })
  @ApiOkResponse({
    description: 'Delete a company',
    type: CompanyAdminResponseDto,
  })
  async deleteCompany(
    @Param('companyId', CompanyUserByIdPipe)
    company: CompanyUser,
  ) {
    return this.userAdminService.deleteCompany(company);
  }

  @Put('company/:companyId')
  @ApiOperation({
    description: 'Update a company',
    summary: 'Update a company',
  })
  @ApiOkResponse({
    description: 'Update a company',
    type: CompanyAdminResponseDto,
  })
  async updateCompany(
    @Body() body: UpdateCompanyAdminDto,
    @Param('companyId', CompanyUserByIdPipe)
    company: CompanyUser,
  ): Promise<CompanyAdminResponseDto> {
    const updatedCompany = await this.userAdminService.updateCompany(
      company,
      body,
    );
    return formatToCompanyAdminResponseDto(updatedCompany);
  }

}
