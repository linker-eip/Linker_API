import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  constructor(
    @Inject('MAILER_PROVIDER') private readonly transporter: Transporter,
  ) {}

  async sendMail(sendMailDto: SendMailDto): Promise<void> {
    await this.transporter.sendMail({
      from: 'linkercontactclient@gmail.com',
      to: sendMailDto.to,
      subject: sendMailDto.subject,
      text: sendMailDto.text,
    });
  }
}
