import { Module } from '@nestjs/common';
import { AuthAdminService } from './auth.service';
import { AuthAdminController } from './auth.controller';

@Module({
  providers: [AuthAdminService],
  controllers: [AuthAdminController]
})
export class AuthAdminModule {}
