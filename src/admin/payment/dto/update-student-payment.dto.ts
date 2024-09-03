import { ApiProperty } from '@nestjs/swagger';
import { StudentPaymentStatus } from '../../../payment/enum/student-payment.status.enum';
import { IsEnum, IsNumber } from 'class-validator';

export class UpdateStudentPaymentDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty({ enum: StudentPaymentStatus })
  @IsEnum(StudentPaymentStatus)
  status: StudentPaymentStatus;
}
