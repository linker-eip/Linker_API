import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entity/contact.entity';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { CreateContactDto } from './dto/create-contact.dto';
import { MailService } from '../mail/mail.service';

describe('ContactService', () => {
  let service: ContactService;
  let controller: ContactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [ContactController],
      providers: [
        ContactService,
        {
          provide: getRepositoryToken(Contact),
          useClass: Repository,
        },
        {
          provide: MailService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
      exports: [ContactService],
    }).compile();

    controller = module.get<ContactController>(ContactController);
    service = module.get<ContactService>(ContactService);
  });

  describe('post contact', () => {
    it('should post contact', async () => {
      const contact: Contact = {
        id: 1,
        email: 'test@gmail.com',
        object: 'test',
        content: 'test',
        createdAt: new Date(),
        isTreated: false,
      };

      const contactDto: CreateContactDto = {
        email: 'test@gmail.com',
        object: 'test',
        content: 'test',
      };

      jest.spyOn(service, 'createContact').mockResolvedValue(contact);

      const res = await controller.createContact(contactDto);

      expect(service.createContact).toHaveBeenCalledWith(contactDto);

      expect(contact).toEqual(res);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
