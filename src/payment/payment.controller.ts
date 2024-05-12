import { Body, Controller, Get, Post, Query, Req, UseGuards, Param, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { StudentPaymentResponseDto } from './dto/student-payment-response.dto';
import { VerifiedUserGuard } from '../admin/auth/guard/user.guard';

@Controller('api/payment')
@ApiBearerAuth()
export class PaymentController {
    constructor(private readonly stripeService: PaymentService,
) {}

    @Get('checkout')
    @UseGuards(VerifiedUserGuard)
    @ApiOperation({ summary: 'Create a checkout session' })
    @ApiOkResponse({ description: 'Return a checkout session' })
    async createProductAndCheckoutSession(
        @Query('mission_id') missionId: string,
        @Req() req
    ) {
        return this.stripeService.createProductAndCheckoutSession(missionId, req);
    }

    @Get('checkout/session')
    @ApiOperation({ summary: 'Get a checkout session' })
    @ApiOkResponse({ description: 'Return a checkout session' })
    async paymentSuccess(@Query('session_id') sessionId: string, @Query('mission_id') missionId: string
    ) {
        return this.stripeService.paymentSuccess(sessionId, missionId);
    }

    @Get('')
    @UseGuards(VerifiedUserGuard)
    @ApiOperation({ summary: 'Get all payments for a mission' })
    @ApiOkResponse({ description: 'Return all payments for a mission' })
    async getPayments(
        @Query('mission_id') missionId: string,
        @Req() req
    ) {
        return this.stripeService.getPayment(missionId, req);
    }

    @Get('student')
    @UseGuards(VerifiedUserGuard)
    @ApiOperation({ summary: 'Get all payments for a student' })
    @ApiOkResponse({ description: 'Return all payments for a student' })
    async getStudentPayments(
        @Req() req
    ) : Promise<StudentPaymentResponseDto[]> {
        return this.stripeService.getStudentPayment(req);
    }

    @Get('student/:studentPaymentId')
    @UseGuards(VerifiedUserGuard)
    @ApiOperation({ summary: 'Get a payment for a student' })
    @ApiOkResponse({ description: 'Return a payment for a student' })
    async getStudentPayment(
        @Req() req,
        @Param('studentPaymentId') studentPaymentId: number
    ) {
        return this.stripeService.getStudentPaymentById(studentPaymentId, req);
    }

    @Put('student/receive/:studentPaymentId')
    @UseGuards(VerifiedUserGuard)
    @ApiOperation({ summary: 'Receive a payment for a student' })
    @ApiOkResponse({ description: 'Return a payment for a student' })
    async receiveStudentPayment(
        @Req() req,
        @Param('studentPaymentId') studentPaymentId: number
    ) {
        return this.stripeService.receiveStudentPayment(studentPaymentId, req);
    }
    
}
