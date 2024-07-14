import {
  Body,
  Controller, FileTypeValidator,
  Get, HttpStatus, MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerifiedUserGuard } from '../admin/auth/guard/user.guard';
import { ChatService } from './chat.service';
import { StudentConversationResponseDto } from './dto/student-conversation-response.dto';
import { CompanyConversationResponseDto } from './dto/company-conversation-response.dto';
import { SendFileInChatDto } from './dto/chat-send-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDocumentAdminDto } from '../admin/document/dto/upload-document-admin.dto';

@ApiBearerAuth()
@UseGuards(VerifiedUserGuard)
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {
  }

  @Get('student/conversations')
  @ApiOperation({ description: 'Get all student conversations ids' })
  @ApiResponse({type: StudentConversationResponseDto})
  async getStudentConversations(
    @Req() req: any,
  ): Promise<StudentConversationResponseDto> {
    return await this.chatService.getStudentConversations(req);
  }

  @Get('company/conversations')
  @ApiOperation({ description: 'Get all company conversations ids' })
  @ApiResponse({type: CompanyConversationResponseDto})
  async getCompanyConversations(
    @Req() req: any,
  ): Promise<CompanyConversationResponseDto> {
    return await this.chatService.getCompanyConversations(req);
  }

  @Post('send-file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ description: 'Send file in chat (TYPE ENUM POSSIBLES VALUES : GROUP = 0, MISSION = 1, PREMISSION = 2, DM = 3' })
  async sendFileInChat(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 3_500_000,
          }),
          new FileTypeValidator({
            fileType: 'image/jpeg',
          }),
        ],
      }),
    )
      file,
    @Req() req: any,
    @Body() body: SendFileInChatDto,
  ): Promise<any> {
    return await this.chatService.sendFileInChat(req, file, body);
  }
}
