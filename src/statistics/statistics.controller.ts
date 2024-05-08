import { Body, Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { StudentStatsResponse } from './dtos/student-stats-response.dto';
import { VerifiedUserGuard } from '../admin/auth/guard/user.guard';

@ApiBearerAuth()
@UseGuards(VerifiedUserGuard)
@ApiTags('Statistics')
@Controller('api/statistics')
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) { }

    @Get('student')
    @ApiOperation({
        description: 'Get statistics as a student',
        summary: 'Get statistics as a student',
    })
    @ApiResponse({
        status: 200,
        type: StudentStatsResponse
    })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    async getStudentStats(@Req() req, @Query('startDate') startDate?: Date, @Query('endDate') endDate?: Date): Promise<StudentStatsResponse> {
        return await this.statisticsService.getStudentStats(req, startDate, endDate);
    }

}
