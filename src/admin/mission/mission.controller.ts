import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MissionService } from './mission.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { missionAdminResponseDto } from './dto/mission-admin-response.dto';
import { MissionSearchOptionAdmin } from './dto/missions-search-option-admin.dto';

@ApiBearerAuth()
@ApiTags('Admin')
@Controller('api/admin/mission')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Post('')
  @ApiOperation({
    description: 'Create a mission',
    summary: 'Create a mission',
  })
  @ApiOkResponse({
    description: 'Create a mission',
    type: CreateMissionDto,
  })
  async createMission(@Body() body: CreateMissionDto) {
    return await this.missionService.createMission(body);
  }

  @Get('')
  @ApiOperation({
    description: 'Get all missions',
    summary: 'Get all missions',
  })
  @ApiOkResponse({
    description: 'Get all missions',
    type: missionAdminResponseDto,
  })
  async findAllMissions(@Query() searchOption: MissionSearchOptionAdmin) {
    const missions = await this.missionService.findAllMissions(searchOption);
    return missions;
  }

  @Delete(':id')
  @ApiOperation({
    description: 'Delete a mission',
    summary: 'Delete a mission',
  })
  @ApiOkResponse({
    description: 'Delete a mission',
    type: missionAdminResponseDto,
  })
  async deleteMission(@Param('id', new ParseIntPipe()) id: number) {
    return await this.missionService.deleteMission(id);
  }
}
