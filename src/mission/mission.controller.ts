import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMissionDto } from './dto/create-mission-dto';
import { MissionService } from './mission.service';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Mission')
@Controller('mission')
export class MissionController {
    constructor(private readonly missionService: MissionService) {}

    @Post()
    @ApiOperation({
        description: 'Create a mission as a company',
        summary: 'Create a mission as a company'
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
        return await this.missionService.deleteMission(missionId, req)
    }
}
