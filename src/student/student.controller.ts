import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Put,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { StudentProfileResponseDto } from './dto/student-profile-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from '../filesystem/file.service';

@Controller('api/student')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Student')
@ApiBearerAuth()
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly fileService: FileService,
  ) {}

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
  @UseInterceptors(
    FilesInterceptor('jobLogos', 10),
    FilesInterceptor('skillLogos', 10),
    FilesInterceptor('studyLogos', 10),
    FileInterceptor('picture'),
  )
  async updateStudentProfile(
    @UploadedFiles() jobLogos: Array<Express.Multer.File>,
    @UploadedFiles() skillLogos: Array<Express.Multer.File>,
    @UploadedFiles() studyLogos: Array<Express.Multer.File>,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
        fileIsRequired: false,
      }),
    )
    picture,
    @Req() req,
    @Body() profileData: CreateStudentProfileDto,
  ) {
    profileData.jobs.forEach(async (job, index) => {
      job.logo = await this.fileService.storeFile(jobLogos[index]);
    });

    profileData.skills.forEach(async (skill, index) => {
      skill.logo = await this.fileService.storeFile(skillLogos[index]);
    });

    profileData.studies.forEach(async (study, index) => {
      study.logo = await this.fileService.storeFile(studyLogos[index]);
    });

    return this.studentService.updateStudentProfile(picture, profileData, req.user);
  }
}
