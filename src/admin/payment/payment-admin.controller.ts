import { Body, Controller, Get, Put } from '@nestjs/common';
import { PaymentAdminService } from './payment-admin.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentPaymentResponseDto } from './dto/student-payment-response.dto';
import { UpdateStudentPaymentDto } from './dto/update-student-payment.dto';

@Controller('api/admin/payment')
@ApiTags('Admin/Payment')
export class PaymentAdminController {
  constructor(private readonly paymentAdminService: PaymentAdminService) {
  }

  @Get()
  @ApiOperation({
    description: 'Get all student payments',
    summary: 'Get all student payments',
  })
  @ApiOkResponse({
    description: 'Get all student payments',
    type: StudentPaymentResponseDto,
  })
  async getStudentPayments(): Promise<StudentPaymentResponseDto[]> {
    return await this.paymentAdminService.getStudentPayments();
  }

  @Put()
  @ApiOperation({
    description: 'Update a student payment',
    summary: 'Update a student payment',
  })
  @ApiOkResponse({
    description: 'Update a student payment',
    type: StudentPaymentResponseDto,
  })
  async updateStudentPayment(
    @Body() body: UpdateStudentPaymentDto,
  ): Promise<StudentPaymentResponseDto> {
    return await this.paymentAdminService.updateStudentPayment(body);
  }
}
