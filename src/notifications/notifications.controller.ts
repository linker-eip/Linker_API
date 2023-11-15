import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
}
