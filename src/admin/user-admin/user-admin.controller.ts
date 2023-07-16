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
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { StudentSearchOptionAdminDto } from './dto/student-search-option-admin.dto';
import { RegisterStudentAdminDto } from './dto/register-student-admin.dto';
import { StudentUserByIdPipe } from './pipes/student.user.pipe';
import { StudentUser } from '../../student/entity/StudentUser.entity';
import { AdminGuard } from '../guards/admin/admin.guard';
import { UpdateStudentAdminDto } from './dto/update-student-admin.dto';

@Controller('api/admin/users')
@UseGuards(AdminGuard)
export class UserAdminController {
  constructor(private readonly userAdminService: UserAdminService) {}

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
}
