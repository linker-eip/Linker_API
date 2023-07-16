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
import { FileModule } from './filesystem/file.module';
import { FileController } from './filesystem/file.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'linker_external'),
    }),
    AuthModule,
    StudentModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CompanyModule,
    MailModule,
    FileModule,
  ],
  controllers: [FileController],
  providers: [JwtStrategy],
})
export class AppModule {}
