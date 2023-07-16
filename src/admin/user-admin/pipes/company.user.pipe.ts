import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { CompanyUser } from '../../../company/entity/CompanyUser.entity';
import { UserAdminService } from '../user-admin.service';

@Injectable()
export class CompanyUserByIdPipe implements PipeTransform {
  constructor(private readonly userAdminService: UserAdminService) {}

  async transform(studentId: string) {
    const studentUser = await this.userAdminService.findOneCompanyById(
      parseInt(studentId),
    );
    if (studentUser) return studentUser;
    else throw new NotFoundException('COMPANY_USER_NOT_FOUND');
  }
}
