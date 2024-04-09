import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { StudentStatsResponse } from './dtos/student-stats-response.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Statistics')
@Controller('api/statistics')
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) {}

    @Get('student')
    @ApiOperation({
        description: 'Get statistics as a student',
        summary: 'Get statistics as a student',
    })
    async getStudentStats(@Req() req) : Promise<StudentStatsResponse>{
        return await this.statisticsService.getStudentStats(req);
    }

}
