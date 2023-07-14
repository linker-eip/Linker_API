import { Injectable } from '@nestjs/common';
import { StudentService } from '../../student/student.service';

@Injectable()
export class UserAdminService {
    constructor(
        private studentService: StudentService
    ) {}

    async findAllStudents() {
        return this.studentService.findAll();
    }
}
