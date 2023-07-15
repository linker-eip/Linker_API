import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UserAdminService } from './user-admin.service';
import { StudentAdminResponseDto } from './dto/students-admin-response.dto';
import { formatToStudentAdminResponseDto } from './dto/students-admin-response.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { StudentSearchOptionAdminDto } from './dto/student-search-option-admin.dto';
import { RegisterStudentAdminDto } from './dto/register-student-admin.dto';
import { StudentUserByIdPipe } from './pipes/student.user.pipe';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { AdminGuard } from '../guards/admin/admin.guard';

@Controller('admin/users')
export class UserAdminController {
  constructor(private readonly userAdminService: UserAdminService) {}

  @Get('students')
  @UseGuards(AdminGuard)
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
    @Body() body: RegisterStudentAdminDto,
    @Param('studentId', StudentUserByIdPipe)
    student: StudentUser,
  ): Promise<StudentAdminResponseDto> {
    const updatedStudent = await this.userAdminService.updateStudent(
      student,
      body,
    );
    return formatToStudentAdminResponseDto(updatedStudent);
  }
}
