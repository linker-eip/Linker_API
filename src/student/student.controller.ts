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
import { FileInterceptor } from '@nestjs/platform-express';
import { FileMimeTypeValidator, SupportedImageMimeTypes } from 'src/document-transfer/src/helpers/fmt.validator';
import { UpdateSkillDto } from './skills/dto/update-skill.dto';
import { UpdateJobsDto } from './jobs/dto/update-jobs.dto';
import { UpdateStudiesDto } from './studies/dto/update-studies.dto';

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
      @UploadedFile(
        new ParseFilePipe({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          validators: [
            new MaxFileSizeValidator({
              maxSize: 3_500_000,
            }),
            new FileTypeValidator({
              fileType: 'image/jpeg',
            }),
          ]
        })
      ) picture,
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
    @Body() body: UpdateSkillDto,
    @Req() req,
    @Param('id') id: number,
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
    @Body() body: UpdateJobsDto,
    @Req() req,
    @Param('id') id: number,
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
    @Body() body: UpdateStudiesDto,
    @Req() req,
    @Param('id') id: number,
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
}
