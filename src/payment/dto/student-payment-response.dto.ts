import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../enum/payment.status.enum';
import { StudentPaymentStatus } from '../enum/student-payment.status.enum';

export class StudentPaymentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  missionName: string;

  @ApiProperty()
  status: StudentPaymentStatus;

  @ApiProperty()
  amount: number;
}
