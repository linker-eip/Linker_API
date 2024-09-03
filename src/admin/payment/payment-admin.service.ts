import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentPayment } from '../../payment/entity/student-payment.entity';
import { StudentPaymentResponseDto } from './dto/student-payment-response.dto';
import { formatToStudentAdminResponseDto } from '../user-admin/dto/students-admin-response.dto';
import { UserAdminService } from '../user-admin/user-admin.service';
import { MissionService } from '../mission/mission.service';
import { formatToMissionAdminBasicDto } from '../mission/dto/mission-admin-response.dto';
import { UpdateStudentPaymentDto } from './dto/update-student-payment.dto';

@Injectable()
export class PaymentAdminService {
  constructor(
    @InjectRepository(StudentPayment)
    private studentPaymentRepository: Repository<StudentPayment>,
    private readonly userAdminService: UserAdminService,
    private readonly missionAdminService: MissionService,
  ) {
  }

  async getStudentPayments(): Promise<StudentPaymentResponseDto[]> {
    const studentPayments = await this.studentPaymentRepository.find();
    const studentPaymentResponseDtos = studentPayments.map(
      async (studentPayment) => {
        const student = await this.userAdminService.findOneStudentById(
          studentPayment.studentId,
        );
        if (!student) {
          throw new NotFoundException('Student not found');
        }
        const mission = await this.missionAdminService.findMissionById(
          studentPayment.missionId,
        );
        const company = await this.userAdminService.findOneCompanyById(
          mission.companyId,
        );
        return {
          id: studentPayment.id,
          mission: formatToMissionAdminBasicDto(mission, company),
          student: formatToStudentAdminResponseDto(student),
          status: studentPayment.status,
          amount: studentPayment.amount,
        };
      },
    );
    return Promise.all(studentPaymentResponseDtos);
  }

  async updateStudentPayment(
    body: UpdateStudentPaymentDto,
  ): Promise<StudentPaymentResponseDto> {
    const studentPayment = await this.studentPaymentRepository.findOne({
      where: { id: body.id },
    });
    if (!studentPayment) {
      throw new NotFoundException('Student payment not found');
    }
    studentPayment.status = body.status;
    await this.studentPaymentRepository.save(studentPayment);
    const student = await this.userAdminService.findOneStudentById(
      studentPayment.studentId,
    );
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    const mission = await this.missionAdminService.findMissionById(
      studentPayment.missionId,
    );
    const company = await this.userAdminService.findOneCompanyById(
      mission.companyId,
    );
    return {
      id: studentPayment.id,
      mission: formatToMissionAdminBasicDto(mission, company),
      student: formatToStudentAdminResponseDto(student),
      status: studentPayment.status,
      amount: studentPayment.amount,
    };
  }
}
