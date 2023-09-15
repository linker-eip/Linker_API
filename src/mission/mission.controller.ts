import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMissionDto } from './dto/create-mission-dto';
import { MissionService } from './mission.service';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('/mission')
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
}
