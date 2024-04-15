import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MissionService } from '../mission/mission.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

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
    
}
    
