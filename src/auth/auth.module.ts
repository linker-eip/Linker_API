import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { StudentModule } from 'src/student/student.module';
import { JwtService } from '@nestjs/jwt';
import { CompanyModule } from 'src/company/company.module';
import { MailModule } from 'src/mail/mail.module';
import { GoogleApiService } from './services/google-api-services';

@Module({
  imports: [StudentModule, CompanyModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, GoogleApiService],
})
export class AuthModule {}
