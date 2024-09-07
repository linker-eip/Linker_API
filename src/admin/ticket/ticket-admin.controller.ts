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
  UseInterceptors,
} from '@nestjs/common';
import { TicketAdminService } from './ticket-admin.service';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetTicketsDto } from '../../ticket/dto/get-ticket.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnswerTicketDto } from '../../ticket/dto/answer-ticket.dto';
import { GetTicketReponseDto } from '../../ticket/dto/get-ticket-reponse.dto';

@Controller('api/admin/ticket')
@ApiTags('Admin/Ticket')
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

  @Get(':ticketId')
  @ApiParam({ name: 'ticketId', required: true })
  @ApiOperation({
    description: 'Get ticket by id',
    summary: 'Get ticket by id',
  })
  @ApiOkResponse({
    type: GetTicketReponseDto,
  })
  async getTicketById(@Req() req, @Param('ticketId') ticketId: number): Promise<GetTicketReponseDto> {
    return this.ticketService.getTicketById(req, ticketId);
  }

  @Post(':ticketId/close')
  @ApiParam({ name: 'ticketId', required: true })
  @ApiOperation({
    description: 'Close ticket',
    summary: 'Close ticket',
  })
  async closeTicket(@Req() req, @Param('ticketId') ticketId: number) {
    return this.ticketService.closeTicket(req, ticketId);
  }

  @Post(':ticketId/open')
  @ApiParam({ name: 'ticketId', required: true })
  @ApiOperation({
    description: 'open ticket',
    summary: 'open ticket',
  })
  async reopenTicket(@Req() req, @Param('ticketId') ticketId: number) {
    return this.ticketService.reopenTicket(req, ticketId);
  }
}
