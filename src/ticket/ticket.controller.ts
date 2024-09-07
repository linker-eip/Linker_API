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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { VerifiedUserGuard } from '../admin/auth/guard/user.guard';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketService } from './ticket.service';
import { GetTicketsDto } from './dto/get-ticket.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnswerTicketDto } from './dto/answer-ticket.dto';

@Controller('api/ticket')
@ApiTags('Ticket')
@ApiBearerAuth()
export class TicketController {
  constructor(private readonly ticketService: TicketService) {
  }

  @Post()
  @UseGuards(VerifiedUserGuard)
  @ApiOperation({
    description: 'Create a ticket',
    summary: 'Create a ticket',
  })
  @UseInterceptors(FileInterceptor('file'))
  async createTicket(
    @Req() req,
    @Body() createTicket: CreateTicketDto,
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
  ) {
    return this.ticketService.createTicket(req, createTicket, file);
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

  @Get('/me')
  @UseGuards(VerifiedUserGuard)
  @ApiOperation({
    description: 'Get user tickets',
    summary: 'Get user tickets',
  })
  async getUserTickets(@Req() req, @Query() body: GetTicketsDto) {
    return this.ticketService.getUserTickets(req, body);
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
