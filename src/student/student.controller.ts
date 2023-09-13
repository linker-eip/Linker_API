import { Body, Controller, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { StudentService } from './student.service';
import { Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { StudentProfileResponseDto } from './dto/student-profile-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/student')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Student')
@ApiBearerAuth()
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
      return this.studentService.findStudentProfile(req.user.email);
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
    @UseInterceptors(FileInterceptor('picture'))
    async updateStudentProfile(
    @UploadedFile() picture,
    @Req() req,
    @Body() CreateStudentProfile: CreateStudentProfileDto,
    ) {
    return this.studentService.updateStudentProfile(
        picture,
        CreateStudentProfile,
        req.user
    );
    }
}