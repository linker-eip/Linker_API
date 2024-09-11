import { ApiProperty } from '@nestjs/swagger';
import { StudentPaymentStatus } from '../../../payment/enum/student-payment.status.enum';
import { StudentAdminResponseDto } from '../../user-admin/dto/students-admin-response.dto';
import { missionAdminResponseBasicDto } from '../../mission/dto/mission-admin-response.dto';

export class StudentPaymentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  mission: missionAdminResponseBasicDto;

  @ApiProperty()
  student: StudentAdminResponseDto;

  @ApiProperty()
  status: StudentPaymentStatus;

  @ApiProperty()
  amount: number;
}
