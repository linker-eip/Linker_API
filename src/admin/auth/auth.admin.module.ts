import { Module, forwardRef } from '@nestjs/common';
import { AuthAdminService } from './auth.admin.service';
import { AuthAdminController } from './auth.admin.controller';
import { AdminModule } from '../admin.module';

@Module({
  imports: [forwardRef(() => AdminModule)],
  providers: [AuthAdminService],
  controllers: [AuthAdminController],
})
export class AuthAdminModule {}
