import { Controller, Get } from '@nestjs/common';
import { UserAdminService } from './user-admin.service';

@Controller('admin/users')
export class UserAdminController {
    constructor(
        private readonly userAdminService: UserAdminService,
    ) {}

    @Get('students')
    async findAllStudents() {
        return this.userAdminService.findAllStudents();
    }
}
