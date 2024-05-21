import {
  Body,
  Controller,
  FileTypeValidator,
  Param,
  ParseFilePipe,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Delete,
  HttpStatus,
  MaxFileSizeValidator,
  Query,
  Post,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { StudentProfileResponseDto } from './dto/student-profile-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateSkillDto } from './skills/dto/update-skill.dto';
import { UpdateJobsDto } from './jobs/dto/update-jobs.dto';
import { UpdateStudiesDto } from './studies/dto/update-studies.dto';
import {
  StudentSearchResponseDto,
  formatToStudentSearchResponseDto,
} from './dto/student-search-response.dto';
import { StudentSearchOptionDto } from './dto/student-search-option.dto';
import { CompanyProfileResponseDto } from '../company/dto/company-profile-response.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UploadStudentDocumentDto } from './dto/upload-student-document.dto';
import { DocumentStatusResponseDto } from './dto/document-status-response.dto';
import { VerifiedUserGuard } from '../admin/auth/guard/user.guard';

@Controller('api/student')
@UseGuards(VerifiedUserGuard)
@ApiTags('Student')
@ApiBearerAuth()
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

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
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 3_500_000,
          }),
          new FileTypeValidator({
            fileType: 'image/jpeg',
          }),
        ],
      }),
    )
    picture,
    @Req() req,
    @Body() CreateStudentProfile: CreateStudentProfileDto,
  ) {
    return this.studentService.updateStudentProfile(
      picture,
      CreateStudentProfile,
      req.user,
    );
  }

  @Put('skill/:id')
  @ApiOperation({
    description: 'Update student skill',
    summary: 'Update student skill',
  })
  @ApiResponse({
    status: 200,
    description: 'Update student skill',
    type: StudentProfileResponseDto,
  })
  async updateSkill(
    @Param('id') id: number,
    @Body() body: UpdateSkillDto,
    @Req() req,
  ) {
    return this.studentService.updateSkill(id, body, req.user);
  }

  @Put('job/:id')
  @ApiOperation({
    description: 'Update student job',
    summary: 'Update student job',
  })
  @ApiResponse({
    status: 200,
    description: 'Update student job',
    type: StudentProfileResponseDto,
  })
  async updateJob(
    @Param('id') id: number,
    @Body() body: UpdateJobsDto,
    @Req() req,
  ) {
    return this.studentService.updateJob(id, body, req.user);
  }

  @Put('studies/:id')
  @ApiOperation({
    description: 'Update student studies',
    summary: 'Update student studies',
  })
  @ApiResponse({
    status: 200,
    description: 'Update student studies',
    type: StudentProfileResponseDto,
  })
  async updateStudies(
    @Param('id') id: number,
    @Body() body: UpdateStudiesDto,
    @Req() req,
  ) {
    return this.studentService.updateStudies(id, body, req.user);
  }

  @Delete('skill/:id')
  @ApiOperation({
    description: 'Delete student skill',
    summary: 'Delete student skill',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete student skill',
    type: StudentProfileResponseDto,
  })
  async deleteSkill(@Req() req, @Param('id') id: number) {
    return this.studentService.deleteSkill(id, req.user);
  }

  @Delete('job/:id')
  @ApiOperation({
    description: 'Delete student job',
    summary: 'Delete student job',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete student job',
    type: StudentProfileResponseDto,
  })
  async deleteJob(@Req() req, @Param('id') id: number) {
    return this.studentService.deleteJob(id, req.user);
  }

  @Delete('studies/:id')
  @ApiOperation({
    description: 'Delete student studies',
    summary: 'Delete student studies',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete student studies',
    type: StudentProfileResponseDto,
  })
  async deleteStudies(@Req() req, @Param('id') id: number) {
    return this.studentService.deleteStudies(id, req.user);
  }

  @Get('search')
  @ApiOperation({
    description: 'Get all students',
    summary: 'Get all students',
  })
  @ApiOkResponse({
    description: 'Get all students',
    type: StudentSearchResponseDto,
    isArray: true,
  })
  async findAllStudents(
    @Query() searchOption: StudentSearchOptionDto,
    @Req() req,
  ): Promise<StudentSearchResponseDto[]> {
    return await this.studentService.findAllStudents(searchOption);
  }

  @Get('companyInfo/:companyId')
  @ApiOperation({
    description: 'Get company info',
    summary: 'Get company info',
  })
  @ApiResponse({
    status: 200,
    description: 'Get company info',
    type: CompanyProfileResponseDto,
  })
  async getCompanyInfoByStudent(@Param('companyId') companyId: number) {
    return this.studentService.getCompanyInfoByStudent(companyId);
  }

  @Post('createPref')
  async createPref() {
    return this.studentService.createPref()
  }

  @Put('preferences')
  async updatePreferences(@Req() req, @Body() updatePreferencesDto: UpdatePreferencesDto) {
    return this.studentService.updatePreferences(req, updatePreferencesDto)
  }


  @Get('preferences')
  @ApiOperation({
    description: 'Get student preferences',
    summary: 'Get student preferences',
  })
  @ApiOkResponse({
    type: UpdatePreferencesDto
  })
  async getPreferences(@Req() req): Promise<UpdatePreferencesDto> {
    return this.studentService.getPreferences(req)
  }

  @Post('documentVerification')
  @ApiOperation({
    description: 'Upload student document',
    summary: 'Upload student document',
  })
  @ApiOkResponse({
    status: 201,
    description: 'Document uploaded successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Document is already validated',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadStudentDocument(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 3_500_000,
          }),
          new FileTypeValidator({
            fileType: 'application/pdf',
          }),
        ],
      }),
    )
    file,
    @Req() req,
    @Body() uploadStudentDocument: UploadStudentDocumentDto,
  ) {
    return this.studentService.uploadStudentDocument(
      file,
      uploadStudentDocument,
      req.user,
    );
  }

  @Get('documentStatus')
  @ApiOperation({
    description: 'Get all documents statuses',
    summary: 'Get all documents statuses',
  })
  @ApiOkResponse({
    description: 'Get all documents statuses',
    type: DocumentStatusResponseDto,
    isArray: true,
  })
  async getDocumentStatus(
    @Req() req,
  ): Promise<DocumentStatusResponseDto[]> {
    return await this.studentService.getDocumentStatus(req.user);
  }
}

