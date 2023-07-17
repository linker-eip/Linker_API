import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUser } from './entity/AdminUser.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: Repository<AdminUser>,
  ) {}

  async findOneAdminByEmail(email: string) {
    const admin = await this.adminUserRepository.findOne({
      where: {
        email: email,
      },
    });
    return admin;
  }
}
