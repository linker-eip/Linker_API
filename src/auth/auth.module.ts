import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { StudentModule } from '../student/student.module';
import { JwtService } from '@nestjs/jwt';
import { CompanyModule } from '../company/company.module';
import { MailModule } from '../mail/mail.module';
import { GoogleApiService } from './services/google-api-services';
import { SiretService } from 'src/siret/siret.service';

@Module({
  imports: [StudentModule, CompanyModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, GoogleApiService, SiretService],
})
export class AuthModule {}
