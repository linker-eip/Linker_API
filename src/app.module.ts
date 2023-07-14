import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './passport/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { CompanyModule } from './company/company.module';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSourceOptions,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
    StudentModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CompanyModule,
    MailModule,
    AdminModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
