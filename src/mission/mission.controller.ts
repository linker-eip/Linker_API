import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
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

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Mission')
@Controller('api/mission')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Post()
  @ApiOperation({
    description: 'Create a mission as a company',
    summary: 'Create a mission as a company',
  })
  async createMission(@Req() req, @Body() body: CreateMissionDto) {
    return await this.missionService.createMission(body, req);
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
  async updateMission(
    @Param('id') missionId: number,
    @Body() body: UpdateMissionDto,
    @Req() req,
  ) {
    return await this.missionService.updateMission(missionId, body, req);
  }

  @Get()
  @ApiOperation({
    description: 'Get all missions from a company',
    summary: 'Get all missions from a company',
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

  @Delete('task/:taskId')
  @ApiOperation({
    description: 'Delete a task for a mission',
    summary: 'Delete a task for a mission',
  })
  async deleteMissionTask(@Param('taskId') taskId: number, @Req() req) {
    return await this.missionService.deleteMissionTask(taskId, req);
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

  @Post('finish/:missionId')
  @ApiOperation({
    description: 'Finish a mission',
    summary: 'Finish a mission',
  })
  async finishMission(@Param('missionId') missionId: number, @Req() req) {
    return await this.missionService.finishMission(missionId, req);
  }
  @Get('info/:missionId')
  @ApiOperation({
    description: 'Get mission details',
    summary: 'Get mission details',
  })
  async getMissionDetails(@Param('missionId') missionId: number, @Req() req) {
    return await this.missionService.getMissionDetails(missionId, req);
  }

}
