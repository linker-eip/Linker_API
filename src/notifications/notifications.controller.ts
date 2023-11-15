import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Notifications')
@Controller('api/notifications')
export class NotificationsController {
    constructor(private readonly notificationService: NotificationsService) { }

    @Get()
    @ApiOperation({
        description: 'Get all users notifications',
        summary: 'Get all users notifications'
    })
    async getNotifications(@Req() req) {
        return await this.notificationService.getNotifications(req)
    }

    @Post()
    @ApiOperation({
        description: 'Update notifications status',
        summary: 'Update notifications status'
    })
    async updateNotificationsStatus(@Req() req, @Body() ids: number[]) {
        return await this.notificationService.updateNotificationsStatus(req, ids)
    }
}
