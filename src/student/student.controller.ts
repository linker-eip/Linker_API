import { Body, Controller, Put, Req } from '@nestjs/common';
import { StudentService } from './student.service';
import { Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { StudentProfileResponseDto } from './dto/student-profile-response.dto';

@Controller('api/student')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Get('profile')
    @ApiOperation({
      description: 'Get student profile',
      summary: 'Get student profile',
    })
    @ApiResponse({
      status: 200,
      description: 'Get student profile',
      type: StudentProfileResponseDto,
    })
    async getStudentProfile(@Req() req) {
      return this.studentService.findStudentProfile(req.email);
    }

    @Put('profile')
    @ApiOperation({
    description: 'Update student profile',
    summary: 'Update student profile',
    })
    @ApiResponse({
    status: 200,
    description: 'Update student profile',
    type: StudentProfileResponseDto,
    })
    async updateStudentProfile(
    @Req() req,
    @Body() CreateStudentProfile: CreateStudentProfileDto,
    ) {
    return this.studentService.updateStudentProfile(
        CreateStudentProfile,
        req
    );
    }
}