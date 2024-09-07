import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TicketAdminService } from './ticket-admin.service';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { GetTicketsDto } from '../../ticket/dto/get-ticket.dto';
import { VerifiedUserGuard } from '../auth/guard/user.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnswerTicketDto } from '../../ticket/dto/answer-ticket.dto';

@Controller('api/admin/ticket')
export class TicketAdminController {
  constructor(private readonly ticketService: TicketAdminService) {
  }

  @Get()
  // @UseGuards(AdminGuard)
  @ApiOperation({
    description: 'Get all tickets',
    summary: 'Get all tickets',
  })
  async getTickets(@Query() body: GetTicketsDto) {
    return this.ticketService.getTickets(body);
  }

  @Post(':ticketId')
  @UseGuards(VerifiedUserGuard)
  @ApiParam({ name: 'ticketId', required: true })
  @ApiOperation({
    description: 'Answer to a ticket',
    summary: 'Answer to a ticket',
  })
  @UseInterceptors(FileInterceptor('file'))
  async answerTicket(
    @Req() req,
    @Body() body: AnswerTicketDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
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
      file: Express.Multer.File,
    @Param('ticketId') ticketId: number,
  ) {
    return this.ticketService.answerTicket(req, body, file, ticketId);
  }
}
