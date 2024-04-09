import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { userInfo } from 'os';
import { GetMissionDto } from 'src/mission/dto/get-mission.dto';
import { MissionService } from 'src/mission/mission.service';
import { ReviewDto, StudentStatsResponse } from './dtos/student-stats-response.dto';
import { StudentProfile } from 'src/student/entity/StudentProfile.entity';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class StatisticsService {
    constructor(
        private readonly missionService: MissionService,
        private readonly studentService: StudentService
    ) {}

    async getStudentStats(req: any): Promise<StudentStatsResponse> {
        console.log(req.user)
        if (req.user.userType != "USER_STUDENT") {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
        }

        const missions = await this.missionService.getStudentMissions(req, {})
        const missionsDto = []
        const reviewsDto = []
        for (let mission of missions) {
            const dto = new GetMissionDto();
            dto.id = mission.id;
            dto.name = mission.name;
            dto.status = mission.status;
            dto.description = mission.description;
            dto.companyId = mission.companyId;
            dto.groupId = mission.groupId;
            dto.startOfMission = mission.startOfMission;
            dto.endOfMission = mission.endOfMission;
            dto.createdAt = mission.createdAt;
            dto.amount = mission.amount;

            missionsDto.push(dto);

            if (mission.comments != null && mission.comments.length > 0) {
                reviewsDto.push({missionId: mission.id, review: mission.comments})
            }
        }

        const profile = await this.studentService.findStudentProfile(req.user.email);


        const response = new StudentStatsResponse()

        response.missions = missionsDto
        response.reviews = reviewsDto
        response.note = profile.note
        response.noteNumber = profile.noteNumber

        return response
    }
}
