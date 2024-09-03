import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetMissionDto } from '../mission/dto/get-mission.dto';
import { MissionService } from '../mission/mission.service';
import {
  IncomeDto,
  ReviewDto,
  StudentStatsResponse,
} from './dtos/student-stats-response.dto';
import { StudentService } from '../student/student.service';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentPayment } from '../payment/entity/student-payment.entity';
import { Repository } from 'typeorm';
import { StudentPaymentStatus } from '../payment/enum/student-payment.status.enum';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly missionService: MissionService,
    private readonly studentService: StudentService,
    @InjectRepository(StudentPayment)
    private readonly studentPaymentRepository: Repository<StudentPayment>,
  ) {
  }

  filterIncomes(response: any, startDate?: Date, endDate?: Date): void {
    if (startDate && endDate && startDate > endDate) {
      throw new Error('La date de début doit être antérieure à la date de fin');
    }

    if (response && response.incomes && response.incomes.length > 0) {
      response.incomes = response.incomes.filter((income) => {
        if (isNaN(startDate.getTime()) || income.paymentDate >= startDate) {
          return true;
        }
        return false;
      });
      response.incomes = response.incomes.filter((income) => {
        if (isNaN(endDate.getTime()) || income.paymentDate <= endDate) {
          return true;
        }
        return false;
      });
    }
  }

  async getStudentStats(
    req: any,
    startDate?,
    endDate?,
  ): Promise<StudentStatsResponse> {
    if (req.user.userType != 'USER_STUDENT') {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const student = await this.studentService.findOneByEmail(req.user.email);

    let missions = [];
    if (student.groupId) {
      missions = await this.missionService.getStudentMissions(req, {});
    }
    const missionsDto = [];
    const reviewsDto = [];
    for (const mission of missions) {
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
        reviewsDto.push({ missionId: mission.id, review: mission.comments });
      }
    }

    const profile = await this.studentService.findStudentProfile(
      req.user.email,
    );

    const response = new StudentStatsResponse();

    response.missions = missionsDto;
    response.reviews = reviewsDto;
    response.note = profile.note;
    response.noteNumber = profile.noteNumber;

    const studentPayments = await this.studentPaymentRepository.find({
      where: { studentId: student.id, status: StudentPaymentStatus.PAID },
    });
    response.incomes = [];
    for (const it of studentPayments) {
      const incomeDto = new IncomeDto();
      incomeDto.amount = it.amount;
      incomeDto.missionId = it.missionId;
      incomeDto.paymentDate = it.paymentDate;
    }

    this.filterIncomes(response, startDate, endDate);

    return response;
  }
}
