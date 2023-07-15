import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { StudentUser } from '../../../student/entity/StudentUser.entity';
import { UserAdminService } from '../user-admin.service';

@Injectable()
export class StudentUserByIdPipe implements PipeTransform {
  constructor(private readonly userAdminService: UserAdminService) {}

  async transform(studentId: string) {
    const studentUser = await this.userAdminService.findOneStudentById(
      parseInt(studentId),
    );
    if (studentUser) return studentUser;
    else throw new NotFoundException('STUDENT_USER_NOT_FOUND');
  }
}
