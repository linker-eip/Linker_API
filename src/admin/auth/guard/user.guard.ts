import { Injectable, ExecutionContext, Inject, HttpException, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StudentService } from 'src/student/student.service';
import { CompanyService } from 'src/company/company.service';
import { HttpStatusCode } from 'axios';

@Injectable()
export class VerifiedUserGuard extends AuthGuard('jwt') {
    constructor(
        private readonly studentService: StudentService,
        private readonly companyService: CompanyService
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const canActivate = await super.canActivate(context);

        if (canActivate) {
            const request = context.switchToHttp().getRequest();
            request.user = request.user;
            if (request.user.userType == "USER_STUDENT") {
                let student = await this.studentService.findOneByEmail(request.user.email)
                if (student == null) return false
                if (student.isVerified) return true
                else throw new HttpException("Cet utilisateur n'est pas vérifié", HttpStatusCode.Forbidden)

            }
            if (request.user.userType == "USER_COMPANY") {
                let company = await this.companyService.findOne(request.user.email)
                if (company == null) return false
                if (company.isActive == true) return true
                else throw new HttpException("Cet utilisateur n'est pas actif", HttpStatusCode.Forbidden)
            }
            return false;
        }
        return false;
    }
}
