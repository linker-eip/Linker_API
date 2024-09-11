import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('Contact')
@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async createContact(@Body() body: CreateContactDto) {
    return this.contactService.createContact(body);
  }
}
