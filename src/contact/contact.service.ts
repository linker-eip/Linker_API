import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entity/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { SendMailDto } from '../mail/dto/send-mail.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly mailService: MailService,
  ) {}

  async createContact(body: CreateContactDto) {
    const contact = new Contact();
    contact.email = body.email;
    contact.object = body.object;
    contact.content = body.content;

    const sendMailDto = new SendMailDto();
    sendMailDto.to = 'linkercontactclient@gmail.com';
    sendMailDto.subject = body.object;
    sendMailDto.text =
      'Vous avez reçu un mail de ' + body.email + ' contenu : ' + body.content;
    this.mailService.sendMail(sendMailDto);

    return this.contactRepository.save(contact);
  }
}
