import { Controller, Get, Query } from '@nestjs/common';
import { UserAdminService } from './user-admin.service';
import { StudentAdminResponseDto } from './dto/students-admin-response.dto';
import { formatToStudentAdminResponseDto } from './dto/students-admin-response.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { StudentSearchOptionAdminDto } from './dto/student-search-option-admin.dto';

@Controller('admin/users')
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
    @Query() searchOption : StudentSearchOptionAdminDto
  ): Promise<StudentAdminResponseDto[]> {
    const students = await this.userAdminService.findAllStudents(searchOption);
    return students.map(formatToStudentAdminResponseDto);
  }
}
