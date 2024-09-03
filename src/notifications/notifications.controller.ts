import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import { VerifiedUserGuard } from '../admin/auth/guard/user.guard';

@ApiBearerAuth()
@UseGuards(VerifiedUserGuard)
@ApiTags('Notifications')
@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {
  }

  @Get()
  @ApiOperation({
    description: 'Get all users notifications',
    summary: 'Get all users notifications',
  })
  async getNotifications(@Req() req) {
    return await this.notificationService.getNotifications(req);
  }

  @Post()
  @ApiOperation({
    description: 'Update notifications status',
    summary: 'Update notifications status',
  })
  async updateNotificationsStatus(
    @Req() req,
    @Body() dto: UpdateNotificationsDto,
  ) {
    return await this.notificationService.updateNotificationsStatus(req, dto);
  }

  @Delete(':id')
  @ApiOperation({
    description: 'Delete notification by id',
    summary: 'Delete notification by id',
  })
  async deleteNotification(@Req() req, @Param('id') id: number) {
    return await this.notificationService.deleteNotification(req, id);
  }
}
