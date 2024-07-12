import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifiedUserGuard } from '../admin/auth/guard/user.guard';
import { ChatService } from './chat.service';
import { StudentConversationResponseDto } from './dto/student-conversation-response.dto';
import { CompanyConversationResponseDto } from './dto/company-conversation-response.dto';

@ApiBearerAuth()
@UseGuards(VerifiedUserGuard)
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('student/conversations')
  @ApiOperation({ description: 'Get all student conversations ids' })
  async getStudentConversations(
    @Req() req: any,
  ): Promise<StudentConversationResponseDto> {
    return await this.chatService.getStudentConversations(req);
  }

  @Get('company/conversations')
  @ApiOperation({ description: 'Get all company conversations ids' })
  async getCompanyConversations(
    @Req() req: any,
  ): Promise<CompanyConversationResponseDto> {
    return await this.chatService.getCompanyConversations(req);
  }
}
