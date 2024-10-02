import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { PaymentAdminService } from './payment-admin.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentPaymentResponseDto } from './dto/student-payment-response.dto';
import { UpdateStudentPaymentDto } from './dto/update-student-payment.dto';
import { AdminGuard } from '../guards/admin/admin.guard';

@Controller('api/admin/payment')
@ApiBearerAuth()
@UseGuards(AdminGuard)
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
