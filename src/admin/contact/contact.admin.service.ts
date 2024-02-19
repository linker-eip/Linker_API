import { Injectable, NotFoundException } from '@nestjs/common';
import { Contact } from './entity/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactAdminService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async findAll(): Promise<Contact[]> {
    return await this.contactRepository.find();
  }

  async update(
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    const contact = await this.contactRepository.findOne({ where: { id: id } });

    if (!contact) {
      throw new NotFoundException(`CONTACT_NOT_FOUND`);
    }

    contact.isTreated = updateContactDto.isTreated;
    return await this.contactRepository.save(contact);
  }

  async delete(id: number): Promise<Contact> {
    const contact = await this.contactRepository.findOne({ where: { id: id } });

    if (!contact) {
      throw new NotFoundException(`CONTACT_NOT_FOUND`);
    }

    return await this.contactRepository.remove(contact);
  }
}
