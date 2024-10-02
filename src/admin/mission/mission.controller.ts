import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query, UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MissionService } from './mission.service';
import { CreateMissionAdminDto } from './dto/create-mission.dto';
import {
  formatToMissionAdminDto,
  missionAdminResponseDto,
} from './dto/mission-admin-response.dto';
import { MissionSearchOptionAdmin } from './dto/missions-search-option-admin.dto';
import { MissionByIdPipe } from './pipes/mission.pipe';
import { Mission } from '../../mission/entity/mission.entity';
import { UpdateMission } from './dto/update-mission.dto';
import { UserAdminService } from '../user-admin/user-admin.service';
import { AdminGuard } from '../guards/admin/admin.guard';

@ApiBearerAuth()
@ApiTags('Admin/Missions')
@UseGuards(AdminGuard)
@Controller('api/admin/mission')
export class MissionController {
  constructor(
    private readonly missionService: MissionService,
    private readonly userAdminService: UserAdminService,
  ) {}

  @Post('')
  @ApiOperation({
    description: 'Create a mission',
    summary: 'Create a mission',
  })
  @ApiOkResponse({
    description: 'Create a mission',
    type: CreateMissionAdminDto,
  })
  async createMission(@Body() body: CreateMissionAdminDto) {
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
    const missionsFormatted = await Promise.all(
      missions.map(async (mission) => {
        const company = await this.userAdminService.findOneCompanyById(
          mission.companyId,
        );
        const students: any[] = [];

        return formatToMissionAdminDto(mission, company, students);
      }),
    );
    return missionsFormatted;
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
  async deleteMission(@Param('id', MissionByIdPipe) missionId: number) {
    return await this.missionService.deleteMission(missionId);
  }

  @Get(':id')
  @ApiOperation({
    description: 'Get a mission',
    summary: 'Get a mission',
  })
  @ApiOkResponse({
    description: 'Get a mission',
    type: missionAdminResponseDto,
  })
  async getMission(@Param('id', MissionByIdPipe) missionId: number) {
    const mission = await this.missionService.findMissionById(missionId);
    const company = await this.userAdminService.findOneCompanyById(
      mission.companyId,
    );
    const students: any[] = [];
    return formatToMissionAdminDto(mission, company, students);
  }

  @Put(':id')
  @ApiOperation({
    description: 'Update a mission',
    summary: 'Update a mission',
  })
  @ApiOkResponse({
    description: 'Update a mission',
    type: missionAdminResponseDto,
  })
  async updateMission(
    @Param('id', MissionByIdPipe) mission: number,
    @Body() body: UpdateMission,
  ) {
    return await this.missionService.updateMission(mission, body);
  }
}
