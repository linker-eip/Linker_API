import { Body, Controller, Get, Post, Query, Req, UseGuards, Param, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MissionService } from '../mission/mission.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StudentPaymentResponseDto } from './dto/student-payment-response.dto';

@Controller('api/payment')
@ApiBearerAuth()
export class PaymentController {
    constructor(private readonly stripeService: PaymentService,
) {}

    @Get('checkout')
    @UseGuards(AuthGuard('jwt'))
    async createProductAndCheckoutSession(
        @Query('mission_id') missionId: string,
        @Req() req
    ) {
        return this.stripeService.createProductAndCheckoutSession(missionId, req);
    }

    @Get('checkout/session')
    async paymentSuccess(@Query('session_id') sessionId: string, @Query('mission_id') missionId: string
    ) {
        return this.stripeService.paymentSuccess(sessionId, missionId);
    }

    @Get('')
    @UseGuards(AuthGuard('jwt'))
    async getPayments(
        @Query('mission_id') missionId: string,
        @Req() req
    ) {
        return this.stripeService.getPayment(missionId, req);
    }

    @Get('student')
    @UseGuards(AuthGuard('jwt'))
    async getStudentPayments(
        @Req() req
    ) : Promise<StudentPaymentResponseDto[]> {
        return this.stripeService.getStudentPayment(req);
    }

    @Get('student/:studentPaymentId')
    @UseGuards(AuthGuard('jwt'))
    async getStudentPayment(
        @Req() req,
        @Param('studentPaymentId') studentPaymentId: number
    ) {
        return this.stripeService.getStudentPaymentById(studentPaymentId, req);
    }

    @Put('student/receive/:studentPaymentId')
    @UseGuards(AuthGuard('jwt'))
    async receiveStudentPayment(
        @Req() req,
        @Param('studentPaymentId') studentPaymentId: number
    ) {
        return this.stripeService.receiveStudentPayment(studentPaymentId, req);
    }
    
}
