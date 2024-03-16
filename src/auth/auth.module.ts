import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { StudentModule } from '../student/student.module';
import { JwtService } from '@nestjs/jwt';
import { CompanyModule } from '../company/company.module';
import { MailModule } from '../mail/mail.module';
import { GoogleApiService } from './services/google-api-services';
import { SiretService } from 'src/siret/siret.service';
import { GroupModule } from '../group/group.module';
import { MissionModule } from '../mission/mission.module';
import { StudentPreferences } from 'src/student/entity/StudentPreferences.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyPreferences } from 'src/company/entity/CompanyPreferences.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentPreferences, CompanyPreferences]),StudentModule, CompanyModule, MailModule, GroupModule, MissionModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, GoogleApiService, SiretService],
})
export class AuthModule {}
