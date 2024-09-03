import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifiedUserGuard } from '../admin/auth/guard/user.guard';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketService } from './ticket.service';
import { GetTicketsDto } from './dto/get-ticket.dto';

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
  async createTicket(@Req() req, @Body() createTicket: CreateTicketDto) {
    return this.ticketService.createTicket(req, createTicket);
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
}
