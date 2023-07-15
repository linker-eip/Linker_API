import { Injectable, ExecutionContext, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AdminService } from '../../admin.service';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(private readonly adminService: AdminService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);

    if (canActivate) {
      const request = context.switchToHttp().getRequest();
      request.user = request.user;
      if (request.user) {
        if (request.user.email === 'adminlinker@gmail.com') return true;
      }
      return false;
    }
    return false;
  }
}
