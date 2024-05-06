import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMissionDto } from './dto/create-mission-dto';
import { UpdateMissionDto } from './dto/update-mission-dto';
import { MissionService } from './mission.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateMissionTaskDto } from './dto/create-mission-task.dto';
import { UpdateMissionTaskDto } from './dto/update-mission-task.dto';
import { MissionTaskDto } from './dto/mission-task.dto';
import { GetMissionDetailsStudentDto } from './dto/get-mission-details-student.dto';
import { GetMissionDetailsCompanyDto } from './dto/get-mission-details-company.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status-dto';
import { GetMissionDto, getInvitedGroups } from './dto/get-mission.dto';
import { MissionSearchOptionStudentDto } from './dto/mission-search-option-student.dto';
import { CommentMissionDto } from './dto/comment-mission.dto';
import { NoteMissionDto } from './dto/note-mission.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MissionInviteStatus } from './enum/mission-invite-status.enum';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Mission')
@Controller('api/mission')
export class MissionController {
  constructor(private readonly missionService: MissionService) { }

  @Post()
  @ApiOperation({
    description: 'Create a mission as a company',
    summary: 'Create a mission as a company',
  })
  @UseInterceptors(FileInterceptor('specifications'))
  async createMission(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
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
    ) file,
    @Req() req, @Body() body: CreateMissionDto) {
    return await this.missionService.createMission(body, req, file);
  }

  @Delete(':id')
  @ApiOperation({
    description: 'Delete a mission as a company',
    summary: 'Delete a mission as a company',
  })
  async deleteMission(@Param('id') missionId: number, @Req() req) {
    return await this.missionService.deleteMission(missionId, req);
  }

  @Put(':id')
  @ApiOperation({
    description: 'Update a mission as a company',
    summary: 'Update a mission as a company',
  })
  @UseInterceptors(FileInterceptor('specifications'))
  async updateMission(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
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
    ) file,
    @Param('id') missionId: number,
    @Body() body: UpdateMissionDto,
    @Req() req,
  ) {
    return await this.missionService.updateMission(missionId, body, req, file);
  }

  @Get()
  @ApiOperation({
    description: 'Get all missions from a company',
    summary: 'Get all missions from a company',
  })
  @ApiOkResponse({
    description: 'Get all missions from a company',
    type: GetMissionDto,
  })
  async getMissions(@Req() req) {
    return await this.missionService.getCompanyMissions(req);
  }

  @Post('task/:missionId')
  @ApiOperation({
    description: 'Create a task for a mission',
    summary: 'Create a task for a mission',
  })
  @ApiOkResponse({
    description: 'Create a task for a mission',
    type: MissionTaskDto,
  })
  async createMissionTask(
    @Param('missionId') missionId: number,
    @Body() body: CreateMissionTaskDto,
    @Req() req,
  ) {
    return await this.missionService.createMissionTask(missionId, body, req);
  }

  @Post('studentTask/:missionId')
  @ApiOperation({
    description: 'Create a task for a mission - AS AN INVITED GROUP',
    summary: 'Create a task for a mission - AS AN INVITED GROUP',
  })
  @ApiOkResponse({
    description: 'Create a task for a mission',
    type: MissionTaskDto,
  })
  async createMissionTaskStudent(
    @Param('missionId') missionId: number,
    @Body() body: CreateMissionTaskDto,
    @Req() req,
  ) {
    return await this.missionService.createMissionTaskStudent(missionId, body, req);
  }

  @Put('task/:taskId')
  @ApiOperation({
    description: 'Update a task for a mission',
    summary: 'Update a task for a mission',
  })
  @ApiOkResponse({
    description: 'Update a task for a mission',
    type: MissionTaskDto,
  })
  async updateMissionTask(
    @Param('taskId') taskId: number,
    @Body() body: UpdateMissionTaskDto,
    @Req() req,
  ) {
    return await this.missionService.updateMissionTask(taskId, body, req);
  }

  @Put('studentTask/:taskId')
  @ApiOperation({
    description: 'Update a task for a mission - AS AN INVITED GROUP',
    summary: 'Update a task for a mission - AS AN INVITED GROUP',
  })
  @ApiOkResponse({
    description: 'Update a task for a mission',
    type: MissionTaskDto,
  })
  async updateMissionTaskStudent(
    @Param('taskId') taskId: number,
    @Body() body: UpdateMissionTaskDto,
    @Req() req,
  ) {
    return await this.missionService.updateMissionTaskStudent(taskId, body, req);
  }

  @Delete('task/:taskId')
  @ApiOperation({
    description: 'Delete a task for a mission',
    summary: 'Delete a task for a mission',
  })
  async deleteMissionTaskStudent(@Param('taskId') taskId: number, @Req() req) {
    return await this.missionService.deleteMissionTask(taskId, req);
  }

  @Delete('studentTask/:taskId')
  @ApiOperation({
    description: 'Delete a task for a mission  - AS AN INVITED GROUP',
    summary: 'Delete a task for a mission  - AS AN INVITED GROUP',
  })
  async deleteMissionTask(@Param('taskId') taskId: number, @Req() req) {
    return await this.missionService.deleteMissionTaskStudent(taskId, req);
  }

  @Get('task/:missionId')
  @ApiOperation({
    description: 'Get all tasks for a mission',
    summary: 'Get all tasks for a mission',
  })
  @ApiOkResponse({
    description: 'Get all tasks for a mission',
    type: MissionTaskDto,
  })
  async getMissionTasks(@Param('missionId') missionId: number, @Req() req) {
    return await this.missionService.getMissionTasks(missionId, req);
  }

  @Put('task/:taskId/affect/:studentId')
  @ApiOperation({
    description:
      'Affect a student to a task - This route should be used by a student',
    summary:
      'Affect a student to a task - This route should be used by a student',
  })
  async affectTask(
    @Param('taskId') taskId: number,
    @Param('studentId') studentId: number,
    @Req() req,
  ) {
    return await this.missionService.affectTask(taskId, studentId, req);
  }

  @Put('task/:taskId/status')
  @ApiOperation({
    description: 'Change task status - This route should be used by a student',
    summary: 'Change task status - This route should be used by a student',
  })
  async updateTaskStatus(
    @Param('taskId') taskId: number,
    @Body() body: UpdateTaskStatusDto,
    @Req() req,
  ) {
    return await this.missionService.updateTaskStatus(taskId, body, req);
  }

  @Post('accept/:missionId/:groupId')
  @ApiOperation({
    description: 'Accept a mission for a group',
    summary: 'Accept a mission for a group',
  })
  async acceptMission(
    @Param('missionId') missionId: number,
    @Param('groupId') groupId: number,
    @Req() req,
  ) {
    return await this.missionService.acceptMission(missionId, groupId, req);
  }

  @Post('acceptGroup/:missionId/:groupId')
  @ApiOperation({
    description: 'Accept a group for a mission AS A COMPANY',
    summary: 'Accept a group for a mission AS A COMPANY',
  })
  async acceptGroup(
    @Param('missionId') missionId: number,
    @Param('groupId') groupId: number,
    @Req() req,
  ) {
    return await this.missionService.acceptGroup(missionId, groupId, req);
  }


  @Post('refuse/:missionId/:groupId')
  @ApiOperation({
    description: 'Refuse a mission for a group',
    summary: 'Refuse a mission for a group',
  })
  async refuseMission(
    @Param('missionId') missionId: number,
    @Param('groupId') groupId: number,
    @Req() req,
  ) {
    return await this.missionService.refuseMission(missionId, groupId, req);
  }

  @Post('refuseGroup/:missionId/:groupId')
  @ApiOperation({
    description: 'Refuse a group for a mission AS A COMPANY',
    summary: 'Refuse a group for a mission AS A COMPANY',
  })
  async refuseGroup(
    @Param('missionId') missionId: number,
    @Param('groupId') groupId: number,
    @Req() req,
  ) {
    return await this.missionService.refuseGroup(missionId, groupId, req);
  }

  @Get('groupToAccept/:missionId')
  @ApiOperation({
    description: 'Get the list of group that accepted missions AS A COMPANY',
    summary: 'Get the list of group that accepted missions AS A COMPANY',
  })
  async getGroupToAccept(@Param('missionId') missionId: number, @Req() req) {
    return await this.missionService.getGroupToAccept(req, missionId)
  }

  @Post('finish/:missionId')
  @ApiOperation({
    description: 'Finish a mission',
    summary: 'Finish a mission',
  })
  async finishMission(@Param('missionId') missionId: number, @Req() req) {
    return await this.missionService.finishMission(missionId, req);
  }
  @Get('info/:missionId/company')
  @ApiOperation({
    description: 'Get mission details for company',
    summary: 'Get mission details',
  })
  @ApiOkResponse({
    description: 'Get mission details',
    type: GetMissionDetailsCompanyDto,
  })
  async getMissionDetails(@Param('missionId') missionId: number, @Req() req) {
    return await this.missionService.getMissionDetailsCompany(missionId, req);
  }

  @Get('info/:missionId/student')
  @ApiOperation({
    description: 'Get mission details for student',
    summary: 'Get mission details',
  })
  @ApiOkResponse({
    description: 'Get mission details',
    type: GetMissionDetailsStudentDto,
  })
  async getMissionDetailsStudent(
    @Param('missionId') missionId: number,
    @Req() req,
  ) {
    return await this.missionService.getMissionDetailsStudent(missionId, req);
  }

  @Get('student/missions')
  @ApiOperation({
    description: 'Get all missions for a student',
    summary: 'Get all missions for a student',
  })
  @ApiOkResponse({
    description: 'Get all missions for a student',
    type: GetMissionDto,
  })
  async getStudentMissions(
    @Query() searchOption: MissionSearchOptionStudentDto,
    @Req() req,
  ) {
    return await this.missionService.getStudentMissions(req, searchOption);
  }

  @Post('company/invite/:missionId/:groupId')
  @ApiOperation({
    description: 'Invite a group to a mission',
    summary: 'Invite a group to a mission',
  })
  async inviteGroup(
    @Param('missionId') missionId: number,
    @Param('groupId') groupId: number,
    @Req() req,
  ) {
    return await this.missionService.inviteGroup(missionId, groupId, req);
  }

  @Get('student/invitations')
  @ApiOperation({
    description: 'Get all invitations for a student',
    summary: 'Get all invitations for a student',
  })
  @ApiOkResponse({
    description: 'Get all invitations for a student',
    type: GetMissionDto,
  })
  async getStudentInvitations(@Req() req, @Query('status') status: MissionInviteStatus) {
    return await this.missionService.getMissionInvites(req, status);
  }

  @Get('invitedGroups/:missionId')
  @ApiOperation({
    description: 'Get all invited groups for a mission',
    summary: 'Get all invited groups for a mission',
  })
  @ApiOkResponse({
    description: 'Get all invited groups for a mission',
    type: getInvitedGroups,
    isArray: true
  })
  async getInvitedStudents(@Req() req, @Param('missionId') missionId: number) {
    return await this.missionService.getInvitedGroups(req, missionId);
  }

  @Put('company/comment/:missionId')
  @ApiOperation({
    description: 'Comment a mission',
    summary: 'Comment a mission',
  })
  async commentMission(
    @Param('missionId') missionId: number,
    @Body() body: CommentMissionDto,
    @Req() req,
  ) {
    return await this.missionService.commentMission(missionId, body, req);
  }

  @Put('company/note/:missionId')
  @ApiOperation({
    description: 'Note a group',
    summary: 'Note a group',
  })
  async noteGroup(
    @Param('missionId') missionId: number,
    @Body() body: NoteMissionDto,
    @Req() req,
  ) {
    return await this.missionService.noteGroup(missionId, body, req);
  }
}
