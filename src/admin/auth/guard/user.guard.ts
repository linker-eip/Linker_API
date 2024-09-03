import {
  Injectable,
  ExecutionContext,
  Inject,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StudentService } from '../../../student/student.service';
import { CompanyService } from '../../../company/company.service';
import { HttpStatusCode } from 'axios';

@Injectable()
export class VerifiedUserGuard extends AuthGuard('jwt') {
  constructor(
    private readonly companyService: CompanyService,
    private readonly studentService: StudentService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);

    if (canActivate) {
      const request = context.switchToHttp().getRequest();
      request.user = request.user;
      if (request.user.userType == 'USER_STUDENT') {
        const student = await this.studentService.findOneByEmail(
          request.user.email,
        );
        if (student == null) return false;
        if (student.isVerified) return true;
        else
          throw new HttpException(
            'Cet utilisateur n\'est pas vérifié',
            HttpStatusCode.Forbidden,
          );
      }
      if (request.user.userType == 'USER_COMPANY') {
        const company = await this.companyService.findOne(request.user.email);
        if (company == null) return false;
        if (company.isActive == true) return true;
        else
          throw new HttpException(
            'Cet utilisateur n\'est pas actif',
            HttpStatusCode.Forbidden,
          );
      }
      return false;
    }
    return false;
  }
}

@Injectable()
export class UnverifiedUserGuard extends AuthGuard('jwt') {
  constructor(
    private readonly companyService: CompanyService,
    private readonly studentService: StudentService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);

    if (canActivate) {
      const request = context.switchToHttp().getRequest();
      request.user = request.user;
      if (request.user.userType == 'USER_STUDENT') {
        const student = await this.studentService.findOneByEmail(
          request.user.email,
        );
        if (student == null) return false;
        return true;
      }
      if (request.user.userType == 'USER_COMPANY') {
        const company = await this.companyService.findOne(request.user.email);
        if (company == null) return false;
        return true;
      }
      return false;
    }
    return false;
  }
}
